# Firefox Policy Deployment Notes

This guide explains how to deploy the **Focus Guard** extension locally using the `policies.json` method. This allows the extension to be "force-installed" and prevents it from being easily disabled or removed by the user.

## Important Requirements
1. **Extension ID:** For policy deployment to work, the extension must have a unique ID defined in its `manifest.json`. 
   - *Example:* Add `"browser_specific_settings": { "gecko": { "id": "focus-guard@local.dev" } }` to `manifest.json`.
2. **Firefox Version:** By default, Firefox only allows signed extensions. To deploy an unsigned local extension via policy, you must use **Firefox Developer Edition**, **Nightly**, or **ESR**, and set `xpinstall.signatures.required` to `false` in `about:config`.

---

## 1. Create the `policies.json` File
Create a file named `policies.json` with the following content. Replace `/PATH/TO/EXTENSION/` with the absolute path to your extension folder or `.xpi` file.

```json
{
  "policies": {
    "ExtensionSettings": {
      "focus-guard@local.dev": {
        "installation_mode": "force_installed",
        "install_url": "file:///PATH/TO/EXTENSION/focus-guard.xpi"
      }
    }
  }
}
```

---

## 2. Deployment Paths by Operating System

### Ubuntu / Linux
Place the `policies.json` file in the `distribution` directory. The path depends on how Firefox was installed:

- **Standard (Apt/Direct):** `/usr/lib/firefox/distribution/policies.json`
- **Alternative System-wide:** `/etc/firefox/policies/policies.json`
- **Snap (Ubuntu Default):** `/var/snap/firefox/common/policies/policies.json`
- **Flatpak:** `~/.var/app/org.mozilla.firefox/config/firefox/distribution/policies.json`

*Note: You may need root/sudo permissions to create these directories and files.*

### macOS
1. Right-click `Firefox.app` in your Applications folder and select **Show Package Contents**.
2. Navigate to `Contents/Resources/`.
3. Create a folder named `distribution` if it doesn't exist.
4. Place `policies.json` inside:
   - `/Applications/Firefox.app/Contents/Resources/distribution/policies.json`

### Windows
1. Open the Firefox installation directory (usually `C:\Program Files\Mozilla Firefox\`).
2. Create a folder named `distribution` if it doesn't exist.
3. Place `policies.json` inside:
   - `C:\Program Files\Mozilla Firefox\distribution\policies.json`

---

## 3. Packaging as .xpi (Recommended)
While some versions of Firefox can load from a directory, it is most reliable to package the extension:
1. Select all files in the project folder (`background.js`, `manifest.json`, etc.).
2. Compress them into a `.zip` archive.
3. Rename the `.zip` file to `focus-guard.xpi`.
4. Use the absolute path to this `.xpi` file in your `policies.json`.

## 4. Verification
1. Restart Firefox.
2. Navigate to `about:policies` in the address bar.
3. Click on **Active** to ensure the "ExtensionSettings" policy is listed and has no errors.
4. Navigate to `about:addons` to confirm the extension is installed and managed by your organization.
