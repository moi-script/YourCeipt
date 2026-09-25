import { Capacitor } from "@capacitor/core";

// Always points at the newest APK attached to a GitHub release, so the
// landing page link never needs editing when a new build ships.
export const APK_URL = "https://github.com/moi-script/YourCeipt/releases/latest/download/recepta.apk";

// Bumped on every APK release. The installed app compares its own build
// number against this file to decide whether to offer an update.
export const VERSION_MANIFEST = "/app-version.json";

export const isNativeApp = () => Capacitor.isNativePlatform();
