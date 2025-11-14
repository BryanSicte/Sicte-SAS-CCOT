import 'dotenv/config';

export default {
  expo: {
    name: "Sicte CCOT",
    slug: "sicte-ccot",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/LogoSicte13.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "3e845c37-4e47-4c6a-bb0d-1ad1897e3c3d"
      }
    },
    splash: {
      image: "./assets/LogoSicte14.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription: "Sicte necesita tu ubicación incluso en segundo plano.",
        NSLocationWhenInUseUsageDescription: "Sicte necesita tu ubicación para registrar actividades."
      },
      bundleIdentifier: "com.sicte.sas.ccot"
    },
    android: {
      package: "com.sicte.sas.ccot",
      adaptiveIcon: {
        foregroundImage: "./assets/LogoSicte13.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ],
      config: {
        googleMaps: {
          "apiKey": "AIzaSyDgoT1jsWnp4t2O-5k-xklh6ZgPc5oOh_8"
        }
      }
    },
    jsEngine: "hermes",
    debug: true,
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
      fallbackToCacheTimeout: 0
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    plugins: [
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Sicte necesita acceder a tu ubicación incluso cuando la app no esté abierta, para registrar tus movimientos de servicio.",
          isAndroidBackgroundLocationEnabled: true
        }
      ]
    ]
  }
}