import React from "react";
import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navegacion/RootNavigator";
import CadenaDeSuministro from "./CadenaDeSuministro";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { darkColors, lightColors } from "../../estilos/Colors";

type Props = NativeStackScreenProps<RootStackParamList, "LogisticaAbastecimiento">;

export default function LogisticaAbastecimiento({ navigation }: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    return (
        <CadenaDeSuministro navigation={navigation} defaultPage="Logistica">
            <View>
                <Text style={{ color: colors.texto, fontSize: 18 }}>Logistica</Text>
            </View>
        </CadenaDeSuministro>
    );
}
