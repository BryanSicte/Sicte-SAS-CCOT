export default ({ config }) => {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || "dev";

  return {
    ...config,
    extra: {
      appEnv,
      apiUrl:
        appEnv === "prod"
          ? process.env.EXPO_PUBLIC_API_URL_PROD
          : process.env.EXPO_PUBLIC_API_URL_DEV
    }
  };
};
