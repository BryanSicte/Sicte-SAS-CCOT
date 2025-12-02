const { withGradleProperties } = require("@expo/config-plugins");

module.exports = function withEnvGradle(config) {
    return withGradleProperties(config, (config) => {
        const envVars = [
            { key: "API_URL_DEV", value: process.env.EXPO_PUBLIC_API_URL_DEV },
            { key: "API_URL_PROD", value: process.env.EXPO_PUBLIC_API_URL_PROD },
            { key: "APP_ENV", value: process.env.EXPO_PUBLIC_APP_ENV },

            { key: "MYAPP_UPLOAD_STORE_FILE", value: "../../sicte-release-key.jks"  },
            { key: "MYAPP_UPLOAD_KEY_ALIAS", value: "sicte_key" },
            { key: "MYAPP_UPLOAD_STORE_PASSWORD", value: "Sicte2025*" },
            { key: "MYAPP_UPLOAD_KEY_PASSWORD", value: "Sicte2025*" },
        ];

        envVars.forEach(({ key, value }) => {
            if (value !== undefined) {
                config.modResults.push({
                    type: "property",
                    key,
                    value,
                });
            }
        });

        return config;
    });
};
