import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

export const exportToExcel = async (
    sheetName: string,
    data: any[],
    headers: string[],
    fileName?: string
) => {
    try {
        if (!data || data.length === 0) {
            Toast.show({
                type: "info",
                text1: "Sin datos",
                text2: "No hay información para exportar.",
                position: "top",
            });
            return;
        }

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const file =
            fileName ||
            `${sheetName.replace(/\s+/g, "_").toLowerCase()}_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;

        if (Platform.OS === "web") {
            const blob = new Blob(
                [XLSX.write(workbook, { type: "array", bookType: "xlsx" })],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
            const uri = FileSystem.documentDirectory + file;

            await FileSystem.writeAsStringAsync(uri, wbout, {
                encoding: FileSystem?.EncodingType?.Base64 || "base64",
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Toast.show({
                    type: "success",
                    text1: "Archivo generado",
                    text2: `Se guardó ${file}`,
                    position: "top",
                });
            }
        }
    } catch (error) {
        console.error("Error exportando Excel:", error);
        Toast.show({
            type: "error",
            text1: "Error",
            text2: "No se pudo exportar el archivo Excel.",
            position: "top",
        });
    }
};
