// Builds a signed APK and publishes it as the latest GitHub release.
//
//   npm run release:android -- 1.1.0 "What changed in this build"
//
// Bumps versionCode/versionName in android/app/build.gradle, writes the same
// numbers to public/app-version.json (which installed apps poll), builds, and
// uploads the APK as `recepta.apk` so the landing page's
// /releases/latest/download/recepta.apk link picks it up. Deploy the web app
// afterwards so the updated app-version.json goes live and phones get the prompt.
//
// Only needed for native changes (new plugins, permissions, icons, Android
// config). Plain web changes reach the app as soon as Vercel deploys.

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [versionName, notes = ""] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(versionName || "")) {
  console.error('Usage: npm run release:android -- <x.y.z> "release notes"');
  process.exit(1);
}

const REPO = "moi-script/YourCeipt";
const root = process.cwd();
const gradlePath = join(root, "android/app/build.gradle");
const manifestPath = join(root, "public/app-version.json");

if (!existsSync(join(root, "android/keystore.properties"))) {
  console.error("android/keystore.properties is missing, so the APK can't be signed with the release key.");
  process.exit(1);
}

let gradle = readFileSync(gradlePath, "utf8");
const versionCode = Number(gradle.match(/versionCode (\d+)/)[1]) + 1;
gradle = gradle
  .replace(/versionCode \d+/, `versionCode ${versionCode}`)
  .replace(/versionName "[^"]*"/, `versionName "${versionName}"`);
writeFileSync(gradlePath, gradle);

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
writeFileSync(manifestPath, JSON.stringify({ ...manifest, versionName, versionCode, notes }, null, 2) + "\n");

const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: "inherit" });
run("npm run build");
run("npx cap sync android");
run(process.platform === "win32" ? "gradlew.bat assembleRelease" : "./gradlew assembleRelease", join(root, "android"));

mkdirSync(join(root, "release"), { recursive: true });
const apk = join(root, "release/recepta.apk");
copyFileSync(join(root, "android/app/build/outputs/apk/release/app-release.apk"), apk);
// The landing page serves this copy so the download never leaves the site.
copyFileSync(apk, join(root, "public/downloads/recepta.apk"));

run(`gh release create v${versionName} "${apk}" --repo ${REPO} --title "Recepta ${versionName}" --notes ${JSON.stringify(notes || `Android build ${versionCode}`)} --latest`);

console.log(`\nReleased ${versionName} (build ${versionCode}). Commit and deploy so public/app-version.json and public/downloads/recepta.apk go live.`);
