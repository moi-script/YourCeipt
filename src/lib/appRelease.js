import { Capacitor } from "@capacitor/core";

// Served from this site, not GitHub. A tap that leaves the site lets Android
// hand the link to another installed browser (seen with Brave), where the
// download stalls. Same-origin plus the `download` attribute keeps it here.
export const APK_URL = "/downloads/recepta.apk";

// The installed app opens update links in the phone's browser, so it needs an
// absolute URL outside the app's own origin. GitHub's latest-release link is it.
export const GITHUB_APK_URL = "https://github.com/moi-script/YourCeipt/releases/latest/download/recepta.apk";

// Bumped on every APK release. The installed app compares its own build
// number against this file to decide whether to offer an update.
export const VERSION_MANIFEST = "/app-version.json";

export const isNativeApp = () => Capacitor.isNativePlatform();
