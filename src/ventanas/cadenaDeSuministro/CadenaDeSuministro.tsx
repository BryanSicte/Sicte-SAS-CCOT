import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useGlobalStyles } from '../../estilos/GlobalStyles';
import DropdownMenuButton from '../../compuestos/DropdownMenuButton';

interface Props {
    navigation: any;
    children: React.ReactNode;
}

export default function CadenaDeSuministro({ 
    navigation, 
    children, 
    defaultPage
}: Props & { 
    defaultPage: string
}) {
    const stylesGlobal = useGlobalStyles();
    const [pageSelect, setPageSelect] = useState(defaultPage);

    const menuOptions = [
        { label: "Resumen", screen: "ResumenAbastecimiento" },
        { label: "Solicitud de Abastecimiento", screen: "SolicitudAbastecimiento" },
        { label: "Bodega", screen: "BodegaAbastecimiento" },
        { label: "Gestion de Compra", screen: "GestionDeCompraAbastecimiento" },
        { label: "Aprobaciones", screen: "AprobacionesAbastecimiento" },
        { label: "Tesoreria", screen: "TesoreriaAbastecimiento" },
    ];

    useEffect(() => {
        const currentRoute = navigation.getState().routes[navigation.getState().index].name;
        if (currentRoute === "CadenaDeSuministro") {
            navigation.navigate("ResumenAbastecimiento");
        }
    }, []);

    const handleSelect = (option: any) => {
        setPageSelect(option.label);
        navigation.navigate(option.screen);
    };

    return (
        <View style={[stylesGlobal.container, { position: "relative" }]}>
            <View style={{ paddingTop: 20, paddingLeft: 20, zIndex: 10 }}>
                <DropdownMenuButton options={menuOptions} onSelect={handleSelect} pageSelect={pageSelect} />
            </View>
            <ScrollView
                contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </View>
    );
}
