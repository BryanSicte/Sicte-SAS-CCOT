import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navegacion/RootNavigator';
import { useGlobalStyles } from '../estilos/GlobalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route, navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const mensaje = route.params?.message

    return (
        <View style={stylesGlobal.container}>
            <Text style={stylesGlobal.title}>📄 Página de Prueba</Text>
            <Text style={stylesGlobal.texto}>Mensaje recibido: {route.params?.message}</Text>
            <Button title="Volver" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 20, fontWeight: 'bold' },
});
