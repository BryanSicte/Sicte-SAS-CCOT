import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import CustomButton from "./Button";
import { darkColors, lightColors } from "../estilos/Colors";
import { useThemeCustom } from "../contexto/ThemeContext";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";

export interface TabItem {
    key: string;
    label: string;
}

interface Props {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tab: string) => void;
}

export default function CustomTabs({ tabs, activeTab, onChange }: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const styles = stylesLocal();

    return (
        <View style={[styles.tabsWrapper, { borderBottomWidth: 1, borderColor: colors.linea }]}>
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() => onChange(tab.key)}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: isActive
                                        ? colors.backgroundContainer
                                        : colors.backgroundBar,
                                    borderColor: colors.linea,
                                    borderBottomWidth: 0,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: isActive ? colors.primary : colors.texto },
                                ]}
                            >
                                {tab.label}
                            </Text>

                            {isActive && (
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: -1,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        backgroundColor: colors.backgroundContainer,
                                    }}
                                />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const stylesLocal = () => {
    const isMobileWeb = useIsMobileWeb();

    return StyleSheet.create({
        tabsWrapper: {
            marginBottom: 10,
            marginTop: isMobileWeb? 10 : 20,
            alignSelf: "stretch",
        },
        tabsContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            paddingLeft: 20,
        },
        tab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderBottomWidth: 1,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            marginRight: 5,
        },
        tabText: {
            fontSize: 16,
            fontWeight: "600",
        },
    });
};