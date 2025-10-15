import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Pressable, ScrollView, Platform } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { darkColors, lightColors } from "../estilos/Colors";
import CustomButton from "./Button";
import CustomInput from "./Input";
import { useMenu } from "../contexto/MenuContext";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
    headers: string[];
    data: (string[])[];
    itemsPerPage?: number;
    onRowPress?: (row: string[]) => void;
}

export default function CustomTable({ headers, data, itemsPerPage = 5, onRowPress }: Props) {
    const styles = stylesLocal();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: number]: string }>({});
    const { isDark } = useThemeCustom();
    const { open } = useMenu();
    const [sortConfig, setSortConfig] = useState<{ key: number | null; direction: "asc" | "desc" }>({
        key: null,
        direction: "asc",
    });

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            row.every((cell, colIndex) => {
                const filterValue = filters[colIndex]?.toLowerCase() || "";
                return cell.toLowerCase().includes(filterValue);
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

    const renderRow = ({ item, index }: { item: string[]; index: number }) => {
        const isEven = index % 2 === 0;
        const isLast = index === paginatedData.length - 1;

        return (
            <Pressable
                onPress={() => onRowPress?.(item)}
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
                    <Text key={colIndex} style={[styles.cell, { width: colWidth }]} numberOfLines={0}>
                        {cell}
                    </Text>
                ))}
            </Pressable>
        );
    };

    const screenWidth = Dimensions.get("window").width - (open ? 314 : 124);
    const minColWidth = Platform.OS === "web" ? 220 : 150;
    const totalMinWidth = headers.length * minColWidth;
    const colWidth = totalMinWidth < screenWidth ? screenWidth / headers.length : minColWidth;

    return (
        <View style={styles.contenedor}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{}}>
                <View style={[styles.table]}>
                    <View style={[styles.row, styles.header]}>
                        {headers.map((header, index) => (
                            <View key={index} style={{ alignItems: "center", minHeight: 60, paddingVertical: 4, width: colWidth }}>
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
                                <CustomInput
                                    style={styles.input}
                                    placeholderTextColor={darkColors.subTexto}
                                    value={filters[index] || ""}
                                    onChangeText={(text) => {
                                        setPage(1);
                                        setFilters((prev) => ({ ...prev, [index]: text }));
                                    }}
                                />
                            </View>
                        ))}
                    </View>

                    <FlatList
                        data={paginatedData}
                        renderItem={renderRow}
                        keyExtractor={(_, index) => index.toString()}
                        ListEmptyComponent={() => (
                            <View style={[styles.row, { justifyContent: "center", alignItems: "center", paddingVertical: 16 }]}>
                                <Text style={[styles.cell, { textAlign: "center" }]}>
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

                <Text style={styles.pageInfo}>
                    Página {page} de {totalPages} | Total: {data.length} ítems {"\n"}
                    Mostrando {paginatedData.length} de {filteredData.length} ítems
                </Text>

                <CustomButton
                    label="Siguiente"
                    variant="gris"
                    onPress={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    style={{ marginLeft: 10, marginTop: 10 }}
                />
            </View>
        </View>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();

    return StyleSheet.create({
        contenedor: {
            alignSelf: "stretch",
            marginHorizontal: 20,
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
            minWidth: Platform.OS === "web" ? 220 : 150,
        },
        header: {
            backgroundColor: isDark ? darkColors.input : lightColors.input,
        },
        headerText: {
            fontWeight: "bold",
            color: isDark ? darkColors.texto : lightColors.texto,
            fontSize: stylesGlobal.subTitle.fontSize - 2,
        },
        paginationContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
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
        }
    });
};