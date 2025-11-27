const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withApiMeta(config) {
    return withAndroidManifest(config, (config) => {
        const apiUrl = process.env.EXPO_PUBLIC_APP_ENV === "prod"
            ? process.env.EXPO_PUBLIC_API_URL_PROD
            : process.env.EXPO_PUBLIC_API_URL_DEV;

        const appMetaData = {
            $: {
                "android:name": "API_URL",
                "android:value": apiUrl
            }
        };

        const application = config.modResults.manifest.application?.[0];
        if (application) {
            application["meta-data"] = application["meta-data"] || [];

            application["meta-data"] = application["meta-data"].filter(
                (m) => m.$["android:name"] !== "API_URL"
            );

            application["meta-data"].push(appMetaData);
        }

        return config;
    });
};
