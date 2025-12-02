const { withGradleProperties } = require("@expo/config-plugins");

module.exports = function withGradleMemory(config) {
    return withGradleProperties(config, (config) => {
        // Ajustes de memoria de Gradle
        const gradleMemory = {
            key: "org.gradle.jvmargs",
            value: "-Xmx6g -Xms2g -XX:MaxMetaspaceSize=2048m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8",
        };

        // Configuraciones adicionales de Gradle
        const extraGradleProps = [
            { key: "org.gradle.daemon", value: "true" },
            { key: "org.gradle.parallel", value: "true" },
            { key: "org.gradle.configureondemand", value: "true" },
            { key: "newArchEnabled", value: "false" },
        ];

        // Actualizar o agregar org.gradle.jvmargs
        let found = false;
        config.modResults = config.modResults.map((item) => {
            if (item.type === "property" && item.key === gradleMemory.key) {
                item.value = gradleMemory.value;
                found = true;
            }
            return item;
        });

        if (!found) {
            config.modResults.push({ type: "property", key: gradleMemory.key, value: gradleMemory.value });
        }

        // Agregar las demás propiedades
        extraGradleProps.forEach((prop) => {
            const exists = config.modResults.find((item) => item.type === "property" && item.key === prop.key);
            if (!exists) {
                config.modResults.push({ type: "property", key: prop.key, value: prop.value });
            }
        });

        return config;
    });
};
