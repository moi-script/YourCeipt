package com.recepta.app;

import android.os.Bundle;
import android.webkit.CookieManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Local plugins must be registered before the bridge starts.
        registerPlugin(ApkUpdaterPlugin.class);
        super.onCreate(savedInstanceState);

        // The app runs on recepta-phi.vercel.app but the API lives on
        // recepta.onrender.com, so session cookies are third-party. Android's
        // WebView blocks those by default, which would break sign-in.
        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(getBridge().getWebView(), true);
    }

    @Override
    public void onPause() {
        super.onPause();
        // Persist cookies so the user stays signed in after the app is killed.
        CookieManager.getInstance().flush();
    }
}
