import React from "react";
import { View, Text } from "react-native";
import { darkColors, lightColors } from "./estilos/Colors";

export const getToastConfig = (isDark: boolean) => {
    const background = isDark ? darkColors.backgroundBar : lightColors.backgroundBar;
    const textColor = isDark ? darkColors.texto : lightColors.texto;

    return {
        success: ({ text1, text2 }: any) => (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "70%",
                    borderRadius: 8,
                    borderColor: "#4CAF50",
                    borderWidth: 1,
                    backgroundColor: background,
                    overflow: "hidden",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}
            >
                <View
                    style={{
                        width: 8,
                        alignSelf: "stretch",
                        minHeight: "100%",
                        backgroundColor: "#4CAF50",
                        marginRight: 10,
                    }}
                />

                <View style={{ flex: 1, paddingBottom: 10, paddingTop: 10, paddingRight: 10 }}>
                    {text1 ? (
                        <Text style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}>
                            {text1}
                        </Text>
                    ) : null}
                    {text2 ? (
                        <Text style={{ color: textColor, fontSize: 14, marginTop: 4 }}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>
        ),

        error: ({ text1, text2 }: any) => (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "70%",
                    borderRadius: 8,
                    borderColor: "#F44336",
                    borderWidth: 1,
                    backgroundColor: background,
                    overflow: "hidden",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}
            >
                <View
                    style={{
                        width: 8,
                        alignSelf: "stretch",
                        minHeight: "100%",
                        backgroundColor: "#F44336",
                        marginRight: 10,
                    }}
                />

                <View style={{ flex: 1, paddingBottom: 10, paddingTop: 10, paddingRight: 10 }}>
                    {text1 ? (
                        <Text style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}>
                            {text1}
                        </Text>
                    ) : null}
                    {text2 ? (
                        <Text style={{ color: textColor, fontSize: 14, marginTop: 4 }}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>
        ),

        info: ({ text1, text2 }: any) => (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "70%",
                    borderRadius: 8,
                    borderColor: "#2196F3",
                    borderWidth: 1,
                    backgroundColor: background,
                    overflow: "hidden",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}
            >
                <View
                    style={{
                        width: 8,
                        alignSelf: "stretch",
                        minHeight: "100%",
                        backgroundColor: "#2196F3",
                        marginRight: 10,
                    }}
                />

                <View style={{ flex: 1, paddingBottom: 10, paddingTop: 10, paddingRight: 10 }}>
                    {text1 ? (
                        <Text style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}>
                            {text1}
                        </Text>
                    ) : null}
                    {text2 ? (
                        <Text style={{ color: textColor, fontSize: 14, marginTop: 4 }}>
                            {text2}
                        </Text>
                    ) : null}
                </View>
            </View>
        ),
    };
};