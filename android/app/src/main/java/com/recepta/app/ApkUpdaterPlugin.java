package com.recepta.app;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

// Downloads a new APK and hands it to Android's installer without leaving the
// app. Opening the link in the phone's browser instead left the download
// sitting on a "downloading" page in some browsers (seen with Brave), and
// people didn't know to open the finished file from their notifications.
@CapacitorPlugin(name = "ApkUpdater")
public class ApkUpdaterPlugin extends Plugin {
    private static final long POLL_MS = 400;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private long downloadId = -1;
    // Set when Android sent the user to "Install unknown apps"; installing
    // resumes when they come back.
    private File pendingInstall;

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url");
        String version = call.getString("version", "latest");
        if (url == null) {
            call.reject("url is required");
            return;
        }

        Context ctx = getContext();
        File dir = ctx.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
        if (dir == null) {
            call.reject("Storage is not available");
            return;
        }
        File apk = new File(dir, "recepta-" + version.replaceAll("[^0-9A-Za-z.]", "") + ".apk");
        if (apk.exists()) apk.delete();

        DownloadManager dm = (DownloadManager) ctx.getSystemService(Context.DOWNLOAD_SERVICE);
        if (downloadId != -1) dm.remove(downloadId);

        DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url))
                .setTitle("Recepta " + version)
                .setDescription("Downloading update")
                .setMimeType("application/vnd.android.package-archive")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                .setDestinationUri(Uri.fromFile(apk));
        downloadId = dm.enqueue(req);
        call.resolve();

        poll(dm, downloadId, apk);
    }

    private void poll(DownloadManager dm, long id, File apk) {
        handler.postDelayed(() -> {
            if (id != downloadId) return;
            try (Cursor c = dm.query(new DownloadManager.Query().setFilterById(id))) {
                if (c == null || !c.moveToFirst()) {
                    emit("failed", 0, "Download was cancelled");
                    return;
                }
                int status = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                long done = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                long total = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                int percent = total > 0 ? (int) (done * 100 / total) : 0;

                if (status == DownloadManager.STATUS_SUCCESSFUL) {
                    downloadId = -1;
                    emit("downloaded", 100, null);
                    install(apk);
                } else if (status == DownloadManager.STATUS_FAILED) {
                    downloadId = -1;
                    emit("failed", percent, "Download failed (" + c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_REASON)) + ")");
                } else {
                    emit("downloading", percent, null);
                    poll(dm, id, apk);
                }
            }
        }, POLL_MS);
    }

    private void install(File apk) {
        Context ctx = getContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !ctx.getPackageManager().canRequestPackageInstalls()) {
            pendingInstall = apk;
            emit("needs-permission", 100, null);
            Intent settings = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + ctx.getPackageName()));
            settings.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(settings);
            return;
        }
        pendingInstall = null;
        Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".fileprovider", apk);
        Intent intent = new Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        ctx.startActivity(intent);
        emit("installing", 100, null);
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        if (pendingInstall == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getContext().getPackageManager().canRequestPackageInstalls()) {
            pendingInstall = null;
            emit("permission-denied", 100, "Allow Recepta to install apps to finish the update");
            return;
        }
        install(pendingInstall);
    }

    private void emit(String state, int percent, String message) {
        JSObject data = new JSObject();
        data.put("state", state);
        data.put("percent", percent);
        if (message != null) data.put("message", message);
        notifyListeners("progress", data);
    }
}
