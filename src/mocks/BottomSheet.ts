import { Platform } from "react-native";

export const BottomSheet =
  Platform.OS === "web"
    ? require("./BottomSheet.web").BottomSheet
    : require("./BottomSheet.native").BottomSheet;

export const BottomSheetView =
  Platform.OS === "web"
    ? require("./BottomSheet.web").BottomSheetView
    : require("./BottomSheet.native").BottomSheetView;

export default BottomSheet;