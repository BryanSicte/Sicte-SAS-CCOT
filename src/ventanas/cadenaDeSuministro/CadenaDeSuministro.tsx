import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useGlobalStyles } from '../../estilos/GlobalStyles';
import DropdownMenuButton from '../../compuestos/DropdownMenuButton';
import { useIsMobileWeb } from '../../utilitarios/IsMobileWeb';

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
    const isMobileWeb = useIsMobileWeb();

    const menuOptions = [
        { label: "Resumen", screen: "ResumenAbastecimiento" },
        { label: "Solicitud de Abastecimiento", screen: "SolicitudAbastecimiento" },
        { label: "Logistica", screen: "LogisticaAbastecimiento" },
        { label: "Compras", screen: "ComprasAbastecimiento" },
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
            <View style={{ paddingVertical: isMobileWeb ? 10 : 20, paddingHorizontal: isMobileWeb ? 10 : 20, zIndex: 10 }}>
                <DropdownMenuButton options={menuOptions} onSelect={handleSelect} pageSelect={pageSelect} />
            </View>
            <ScrollView
                contentContainerStyle={{ paddingTop: isMobileWeb ? 0 : 0, paddingHorizontal: isMobileWeb ? 10 : 20, paddingBottom: isMobileWeb ? 10 : 20, height: "100%" }}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </View>
    );
}
