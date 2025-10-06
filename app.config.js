export default {
  expo: {
    name: "Sicte CCOT",
    slug: "sicte-ccot",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/LogoSicte12.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    extra: {
      apiUrl: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
    },
    splash: {
      image: "./assets/LogoSicte12.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/LogoSicte12.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    jsEngine: "jsc",
    web: {
      favicon: "./assets/LogoSicte12.png",
      bundler: "metro"
    },
    plugins: [
      "expo-font"
    ]
  }
}