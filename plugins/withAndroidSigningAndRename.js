// plugins/withAndroidSigningAndRename.js
const { withAppBuildGradle } = require("expo/config-plugins");

module.exports = function withAndroidSigningAndRename(config) {
  return withAppBuildGradle(config, (config) => {
    let src = config.modResults.contents;

    const signingBlock = `
    signingConfigs {
        release {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;

    // Inserta o reemplaza signingConfigs
    if (!src.includes("signingConfigs {")) {
      src = src.replace(/android\s*\{/, (m) => `${m}\n${signingBlock}`);
    } else if (!src.includes("MYAPP_UPLOAD_STORE_FILE")) {
      src = src.replace(/signingConfigs\s*\{[\s\S]*?\}/m, signingBlock);
    }

    // buildTypes dentro de android, con release usando la firma release y debug usando debug
    src = src.replace(/signingConfig\s+signingConfigs\.debug/g, "signingConfig signingConfigs.release");
    if (!/buildTypes\s*\{[\s\S]*release\s*\{[\s\S]*signingConfig signingConfigs.release/.test(src)) {
      src = src.replace(/buildTypes\s*\{[\s\S]*release\s*\{[\s\S]*\}/m,
        (m) => m.replace(/release\s*\{/, "release {\n        signingConfig signingConfigs.release\n")
      );
    }
    src = src.replace(/buildTypes\s*\{[\s\S]*debug\s*\{[\s\S]*signingConfig signingConfigs\.release/g,
      (m) => m.replace(/signingConfig signingConfigs\.release/, "signingConfig signingConfigs.debug"));

    // Limpia la llave extra antes de buildTypes
    src = src.replace(/\n\s*\}\s*\n\s*buildTypes/, "\n    buildTypes");

    // Renombre opcional del APK
    const renameBlock = `
// ==== Rename APK plugin injected ====
android.applicationVariants.all { variant ->
    if (variant.buildType.name == "release") {
        variant.outputs.all { output ->
            outputFileName = "Sicte_CCOT-v${'$'}{variant.versionName}.apk"
        }
    }
}
// ==== End rename APK ====
`;
    if (!src.includes("Rename APK plugin injected")) {
      src = src.trimEnd() + `\n${renameBlock}\n`;
    }

    config.modResults.contents = src;
    return config;
  });
};
