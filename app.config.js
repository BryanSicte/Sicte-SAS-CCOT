module.exports = ({ config }) => {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || "dev";
  const appVersion = "1.0.6";

  const apiUrls = {
    dev: process.env.EXPO_PUBLIC_API_URL_DEV,
    prod: process.env.EXPO_PUBLIC_API_URL_PROD
  };

  const apiUrl = apiUrls[appEnv];

  return {
    ...config,

    name: "Sicte CCOT",
    slug: "sicte-ccot",
    version: appVersion,
    orientation: "default",
    newArchEnabled: false,

    icon: "./assets/LogoSicte13.png",

    extra: {
      appEnv,
      apiUrl,
      appVersion,
      eas: {
        projectId: "3e845c37-4e47-4c6a-bb0d-1ad1897e3c3d"
      }
    },

    splash: {
      image: "./assets/LogoSicte15.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },

    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Sicte necesita tu ubicación incluso en segundo plano.",
        NSLocationWhenInUseUsageDescription:
          "Sicte necesita tu ubicación para registrar actividades."
      },
      bundleIdentifier: "com.sicte.sas.ccot"
    },

    android: {
      package: "com.sicte.sas.ccot",
      icon: "./assets/LogoSicte13.png",
      edgeToEdgeEnabled: true,
      versionCode: 4,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: "AIzaSyDgoT1jsWnp4t2O-5k-xklh6ZgPc5oOh_8"
        }
      }
    },

    web: {
      bundler: "metro",
      favicon: "./assets/LogoSicte12.png",
      name: "Sicte CCOT",
      shortName: "CCOT",
      themeColor: "#ffffff",
      backgroundColor: "#ffffff"
    },

    updates: {
      url: "https://u.expo.dev/3e845c37-4e47-4c6a-bb0d-1ad1897e3c3d",
      enabled: false,
      checkAutomatically: "NEVER",
      fallbackToCacheTimeout: 0
    },

    runtimeVersion: {
      policy: "appVersion"
    },

    plugins: [
      "./plugins/gradle-env-plugin",
      "./plugins/withApiMeta",
      "./plugins/withGradleMemory",
      "./plugins/withAndroidSigningAndRename",
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Sicte necesita acceder a tu ubicación incluso cuando la app no esté abierta.",
          isAndroidBackgroundLocationEnabled: true
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            extraProguardRules: `
              -keep class com.sicte.** { *; }
            `
          }
        }
      ]
    ]
  };
};
