import { Capacitor } from "@capacitor/core";

// The browser download trick (blob URL + <a download>) does nothing inside the
// Android app's WebView, so exports silently failed there. In the app the file
// is written to Documents/Recepta and announced with a notification that opens
// the share sheet, so it can go to Sheets, Drive, email and so on.

const NOTIFY_ACTION = "recepta-export";
let listening = false;

async function shareFile(uri, title) {
  const { Share } = await import("@capacitor/share");
  await Share.share({ title, url: uri, dialogTitle: `Open ${title}` }).catch(() => {});
}

async function listenForTaps() {
  if (listening) return;
  listening = true;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  LocalNotifications.addListener("localNotificationActionPerformed", ({ notification }) => {
    const { uri, name } = notification.extra || {};
    if (notification.extra?.kind === NOTIFY_ACTION && uri) shareFile(uri, name);
  });
}

async function notify(name, uri) {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  let { display } = await LocalNotifications.checkPermissions();
  if (display === "prompt" || display === "prompt-with-rationale") {
    ({ display } = await LocalNotifications.requestPermissions());
  }
  if (display !== "granted") return false;
  await listenForTaps();
  await LocalNotifications.schedule({
    notifications: [
      {
        id: Math.floor(Date.now() % 2147483647),
        title: "Export saved",
        body: `${name} is in Documents/Recepta. Tap to open or share it.`,
        smallIcon: "ic_stat_recepta",
        extra: { kind: NOTIFY_ACTION, uri, name },
      },
    ],
  });
  return true;
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

/**
 * Saves text content as a file.
 * @returns {Promise<{ native: boolean, location?: string, notified?: boolean }>}
 */
export async function saveTextFile(content, name, mime) {
  if (!Capacitor.isNativePlatform()) {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { native: false };
  }

  // App 1.0.0 loads this code without the file plugins; the browser download
  // trick doesn't work in its WebView either, so point the user at the update.
  if (!Capacitor.isPluginAvailable("Filesystem")) {
    throw new Error("Update Recepta to the latest version to save exports on your phone.");
  }

  const { Filesystem, Directory } = await import("@capacitor/filesystem");
  const path = `Recepta/${name}`;
  let result;
  try {
    // Public Documents, so the file shows up in the phone's Files app.
    result = await Filesystem.writeFile({ path, data: utf8ToBase64(content), directory: Directory.Documents, recursive: true });
  } catch {
    // Some phones refuse public storage; the app's own folder always works,
    // and the share sheet still lets the user send the file anywhere.
    result = await Filesystem.writeFile({ path, data: utf8ToBase64(content), directory: Directory.Data, recursive: true });
    await shareFile(result.uri, name);
    return { native: true, location: "app storage", notified: false };
  }

  const notified = await notify(name, result.uri).catch(() => false);
  return { native: true, location: "Documents/Recepta", notified };
}

// Tells the user where an export went. In the app there's no browser download
// bar, so without this the tap looked like it did nothing.
export async function exportWithFeedback(toast, content, name, type) {
  try {
    const saved = await saveTextFile(content, name, type);
    if (saved.native) {
      toast.success(
        `Saved ${name}`,
        saved.notified ? `In ${saved.location}. Tap the notification to open or share it.` : `In ${saved.location}.`
      );
    }
  } catch (err) {
    toast.error("Couldn't save the file", err?.message || "Please try again.");
  }
}
