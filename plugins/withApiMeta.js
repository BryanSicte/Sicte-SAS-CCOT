const { withGradleProperties } = require("@expo/config-plugins");

module.exports = function withEnvGradle(config) {
    return withGradleProperties(config, (config) => {
        const envVars = [
            { key: "API_URL_DEV", value: process.env.EXPO_PUBLIC_API_URL_DEV },
            { key: "API_URL_PROD", value: process.env.EXPO_PUBLIC_API_URL_PROD },
            { key: "APP_ENV", value: process.env.EXPO_PUBLIC_APP_ENV },
        ];

        envVars.forEach(({ key, value }) => {
            if (value === undefined) return;

            const exists = config.modResults.some(
                (prop) => prop.key === key
            );

            if (!exists) {
                config.modResults.push({
                    type: "property",
                    key,
                    value,
                });
            } else {
                config.modResults = config.modResults.map((prop) =>
                    prop.key === key ? { ...prop, value } : prop
                );
            }
        });

        return config;
    });
};
