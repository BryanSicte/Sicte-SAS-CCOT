import { Platform } from "react-native";

export const KeyboardAwareScrollView =
  Platform.OS === "web"
    ? require("./KeyboardAwareScrollView.web").KeyboardAwareScrollView
    : require("./KeyboardAwareScrollView.native").KeyboardAwareScrollView;