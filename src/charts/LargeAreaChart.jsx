import React, { useMemo } from 'react';
import { Platform, Dimensions } from "react-native";
import EChart from "../componentes/EChart";
import { useThemeCustom } from '../contexto/ThemeContext';
import { darkColors, lightColors } from '../estilos/Colors';

export default function LargeAreaChart({ data, height = "100%", title, nameSeries }) {
    const isWeb = Platform.OS === "web";
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    const option = useMemo(() => ({
        backgroundColor: colors.backgroundContainer,
        grid: {
            left: 40,
            right: 20,
            top: 60,
            bottom: isWeb ? 70 : 130,
        },
        textStyle: {
            fontSize: isWeb ? 12 : 20,
            color: colors.texto
        },
        tooltip: {
            trigger: "axis",
            textStyle: {
                fontSize: isWeb ? 12 : 40,
                color: colors.texto
            },
            backgroundColor: colors.backgroundBar,
            position: function (pos, params, dom, rect, size) {
                const obj = { top: 10 };

                if (pos[0] + size.contentSize[0] > size.viewSize[0]) {
                    obj.left = pos[0] - size.contentSize[0] - 10;
                } else {
                    obj.left = pos[0] + 10;
                }

                return obj;
            }
        },
        title: {
            left: "center",
            text: title,
            textStyle: {
                fontSize: isWeb ? 16 : 35,
                color: colors.texto
            },
        },
        toolbox: {
            show: false,
        },
        xAxis: {
            type: "time",
            boundaryGap: false,
            axisLabel: {
                fontSize: isWeb ? 10 : 25,
                color: colors.texto
            },
        },
        yAxis: {
            type: "value",
            boundaryGap: [0, "100%"],
            axisLabel: {
                fontSize: isWeb ? 10 : 25,
                color: colors.texto
            }
        },
        dataZoom: [
            {
                type: "inside",
            },
            {
                type: "slider",
                show: true,
                height: isWeb ? 35 : 40,
                bottom: isWeb ? 0 : 30,
                borderColor: "transparent",
                backgroundColor: colors.backgroundContainer,
                fillerColor: colors.backgroundBar,
                handleSize: isWeb ? "80%" : "200%",
                handleStyle: {
                    color: colors.primaryText,
                },
                textStyle: {
                    color: colors.texto,
                    fontSize: isWeb ? 11 : 18,
                }
            }
        ],
        series: [
            {
                name: nameSeries,
                type: "line",
                smooth: true,
                symbol: "none",
                areaStyle: {
                    color: isDark ? "#5bc432ff" : "#3843d4ff",
                },
                lineStyle: {
                    width: isWeb ? 1.5 : 3,
                    color: isDark ? "#5bc432ff" : "#3843d4ff",
                },
                itemStyle: {
                    color: isDark ? "#5bc432ff" : "#3843d4ff",
                },
                data: data,
            },
        ],
    }), [data, title, nameSeries]);

    return (
        <EChart
            option={option}
            height={
                isWeb
                    ? height
                    : Dimensions.get("window").height
            }
        />
    );
}
