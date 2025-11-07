import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Pressable, ScrollView, Platform } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { darkColors, lightColors } from "../estilos/Colors";
import CustomButton from "./Button";
import CustomInput from "./Input";
import { useMenu } from "../contexto/MenuContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";

interface Props {
    headers: string[];
    data: (string[])[];
    itemsPerPage?: number;
    leer?: boolean;
    onLeer?: (row: string[]) => void;
    editar?: boolean;
    onEditar?: (row: string[]) => void;
    eliminar?: boolean;
    onEliminar?: (row: string[]) => void;
}

export default function CustomTable({
    headers,
    data,
    itemsPerPage = 5,
    leer = false,
    onLeer,
    editar = false,
    onEditar,
    eliminar = false,
    onEliminar,
}: Props) {
    const styles = stylesLocal();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: number]: string }>({});
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { open } = useMenu();
    const [sortConfig, setSortConfig] = useState<{ key: number | null; direction: "asc" | "desc" }>({
        key: null,
        direction: "asc",
    });

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            row.every((cell, colIndex) => {
                const filterValue = filters[colIndex]?.toLowerCase() || "";
                const cellValue = String(cell ?? "").toLowerCase();
                return cellValue.includes(filterValue);
            })
        );
    }, [filters, data]);

    const sortedData = useMemo(() => {
        if (sortConfig.key === null) return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            const valA = a[sortConfig.key] || "";
            const valB = b[sortConfig.key] || "";

            const dateA = new Date(valA);
            const dateB = new Date(valB);
            const isDate = !isNaN(dateA.getTime()) && !isNaN(dateB.getTime());

            if (isDate) {
                return sortConfig.direction === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }

            const numA = parseFloat(valA);
            const numB = parseFloat(valB);
            const isNumber = !isNaN(numA) && !isNaN(numB);

            if (isNumber) {
                return sortConfig.direction === "asc" ? numA - numB : numB - numA;
            }

            return sortConfig.direction === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        });
        return sorted;
    }, [filteredData, sortConfig]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return sortedData.slice(start, start + itemsPerPage);
    }, [page, sortedData, itemsPerPage]);

    const handleSort = (index: number) => {
        setSortConfig((prev) => {
            if (prev.key === index) {
                return { key: index, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key: index, direction: "asc" };
        });
    };

    const handleLeer = (item) => {
        onLeer(item);
    };

    const handleEditar = (item) => {
        onEditar(item);
    };

    const handleEliminar = (item) => {
        onEliminar(item);
    };

    const isMobileWeb = useIsMobileWeb();
    const screenWidth = Dimensions.get("window").width - (open ? (249 + 20 + 20 + 10 + 10 + 5) : (59 + 20 + 20 + 10 + 10 + 5));
    const minColWidth = !isMobileWeb ? 160 : 150;
    const totalMinWidth = (editar || eliminar) ? (headers.length + 1) * minColWidth : headers.length * minColWidth;
    const colWidth = totalMinWidth < screenWidth ? screenWidth / ((editar || eliminar) ? (headers.length + 1) : headers.length) : minColWidth;

    const renderRow = ({ item, index }: { item: string[]; index: number }) => {
        const isEven = index % 2 === 0;
        const isLast = index === paginatedData.length - 1;

        return (
            <Pressable
                style={({ hovered, pressed }) => [
                    styles.row,
                    {
                        borderBottomWidth: isLast ? 0 : 1,
                        backgroundColor: pressed
                            ? isDark ? darkColors.backgroundRowTablePressed : lightColors.backgroundRowTablePressed
                            : hovered
                                ? isDark ? darkColors.backgroundRowTableHover : lightColors.backgroundRowTableHover
                                : isEven
                                    ? (isDark ? darkColors.backgroundRowTable1 : lightColors.backgroundRowTable1)
                                    : (isDark ? darkColors.backgroundRowTable2 : lightColors.backgroundRowTable2),
                    },
                ]}
            >
                {item.map((cell, colIndex) => (
                    <Pressable
                        key={colIndex}
                        onPress={() => {
                            if (leer) {
                                handleLeer?.(item);
                            }
                        }}
                        android_ripple={{ color: isDark ? darkColors.backgroundRowTablePressed : lightColors.backgroundRowTablePressed }}
                        style={({ pressed }) => [
                            { justifyContent: "center", paddingVertical: 8, width: colWidth || 150 },
                            pressed && { opacity: 0.7 },
                        ]}
                        disabled={!leer}
                    >
                        <Text style={[styles.cell]} numberOfLines={0}>
                            {cell}
                        </Text>
                    </Pressable>
                ))}

                {(editar === true || eliminar === true) && (
                    <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, width: colWidth || 150 }}>
                        {editar === true && (
                            <Pressable onPress={() => handleEditar(item)}>
                                <Ionicons name="create-outline" size={25} color={colors.icono} />
                            </Pressable>
                        )}
                        {eliminar === true && (
                            <TouchableOpacity onPress={() => handleEliminar(item)}>
                                <Ionicons name="trash-outline" size={25} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <View style={styles.contenedor}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{}}>
                <View style={[styles.table]}>
                    <View style={[styles.row, styles.header]}>
                        {headers.map((header, index) => (
                            <View key={index} style={{ alignItems: "center", minHeight: 60, paddingVertical: 4, paddingHorizontal: 4, width: colWidth || 150 }}>
                                <TouchableOpacity
                                    onPress={() => handleSort(index)}
                                    style={[styles.cell]}
                                >
                                    <Text style={[styles.headerText, { marginRight: 4 }]}>{header}</Text>
                                    {sortConfig.key === index && (
                                        <Ionicons
                                            name={sortConfig.direction === "asc" ? "chevron-up-outline" : "chevron-down-outline"}
                                            size={16}
                                            color={isDark ? darkColors.texto : lightColors.texto}
                                        />
                                    )}
                                </TouchableOpacity>
                                <View style={{ alignSelf: "center" }}>
                                    <CustomInput
                                        style={[styles.input]}
                                        placeholderTextColor={darkColors.subTexto}
                                        value={filters[index] || ""}
                                        onChangeText={(text) => {
                                            setPage(1);
                                            setFilters((prev) => ({ ...prev, [index]: text }));
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                        {(editar === true || eliminar === true) && (
                            <View style={{ alignItems: "center", justifyContent: "center", width: colWidth || 150 }}>
                                <Text style={[styles.headerText]}>Acciones</Text>
                            </View>
                        )}
                    </View>

                    <FlatList
                        data={paginatedData}
                        renderItem={renderRow}
                        keyExtractor={(_, index) => index.toString()}
                        ListEmptyComponent={() => (
                            <View style={[styles.row, { justifyContent: "center", alignItems: "center", paddingVertical: 16 }]}>
                                <Text style={[styles.cell, { textAlign: isMobileWeb ? "left" : "center", marginLeft: isMobileWeb ? 20 : 0 }]}>
                                    Sin información
                                </Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>

            <View style={styles.paginationContainer}>
                <CustomButton
                    label="Anterior"
                    variant="gris"
                    onPress={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    style={{ marginRight: 10, marginTop: 10 }}
                />

                {!isMobileWeb && (
                    <Text style={styles.pageInfo}>
                        Página {page} de {totalPages} | Total: {data.length} ítems {"\n"}
                        Mostrando del{" "}{Math.min((page - 1) * itemsPerPage + 1, filteredData.length)}{" "}al{" "}
                        {Math.min(page * itemsPerPage, filteredData.length)}{" "}de {filteredData.length} ítems
                    </Text>
                )}

                <CustomButton
                    label="Siguiente"
                    variant="gris"
                    onPress={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    style={{ marginLeft: 10, marginTop: 10 }}
                />
            </View>

            {isMobileWeb && (
                <Text style={styles.pageInfo}>
                    Página {page} de {totalPages} | Total: {data.length} ítems {"\n"}
                    Mostrando del{" "}{Math.min((page - 1) * itemsPerPage + 1, filteredData.length)}{" "}al{" "}
                    {Math.min(page * itemsPerPage, filteredData.length)}{" "}de {filteredData.length} ítems
                </Text>
            )}
        </View>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();
    const isMobileWeb = useIsMobileWeb();

    return StyleSheet.create({
        contenedor: {
            alignSelf: "stretch",
            padding: 10,
            borderWidth: 1,
            borderColor: isDark ? darkColors.linea : lightColors.linea,
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: isDark ? darkColors.backgroundBar : lightColors.backgroundBar,
        },
        table: {
            alignSelf: "stretch",
            borderWidth: 1,
            borderColor: isDark ? darkColors.linea : lightColors.linea,
            borderRadius: 5,
            overflow: "hidden",
            width: "100%",
        },
        row: {
            flexDirection: "row",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderColor: isDark ? darkColors.linea : lightColors.linea,
            alignItems: "center",
            width: "100%",
        },
        cell: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: isDark ? darkColors.texto : lightColors.texto,
            fontSize: stylesGlobal.texto.fontSize,
            minWidth: !isMobileWeb ? 140 : 140,
        },
        header: {
            backgroundColor: isDark ? darkColors.input : lightColors.input,
        },
        headerText: {
            fontWeight: "bold",
            color: isDark ? darkColors.texto : lightColors.texto,
            fontSize: stylesGlobal.texto.fontSize,
            textAlign: "center",
        },
        paginationContainer: {
            flexDirection: "row",
            justifyContent: isMobileWeb ? "center" : "space-between",
            alignItems: "center",
        },
        pageInfo: {
            flex: 1,
            textAlign: "center",
            fontSize: stylesGlobal.subTexto.fontSize,
            color: isDark ? darkColors.texto : lightColors.texto,
            marginTop: 10,
        },
        input: {
            marginHorizontal: 10,
            marginVertical: 0,
            marginTop: 5,
            minWidth: !isMobileWeb ? 140 : 140,
        }
    });
};