const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withRenameAPK(config) {
  return withAppBuildGradle(config, (config) => {
    const renameBlock = `
    // ==== Rename APK plugin injected ====
    android.applicationVariants.all { variant ->
        if (variant.buildType.name == "release") {
            variant.outputs.all { output ->
                outputFileName = "Sicte_CCOT-v\${variant.versionName}.apk"
            }
        }
    }
    // ==== End rename APK ====
    `;

    // Solo agrega el bloque si no está ya
    if (!config.modResults.contents.includes("Rename APK plugin injected")) {
      config.modResults.contents += `\n${renameBlock}\n`;
    }

    return config;
  });
};
