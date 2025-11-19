import React, { useMemo } from 'react';
import { Platform, Dimensions } from "react-native";
import EChart from "../componentes/EChart";

export default function LargeAreaChart({ data, height = "100%", title, nameSeries, onZoomChange }) {

    const option = useMemo(() => ({
        tooltip: {
            trigger: "axis",
            position: function (pt) {
                return [pt[0], "10%"];
            },
        },
        title: {
            left: "center",
            text: title,
        },
        toolbox: {
            show: false,
        },
        xAxis: {
            type: "time",
            boundaryGap: false,
        },
        yAxis: {
            type: "value",
            boundaryGap: [0, "100%"],
        },
        dataZoom: [
            {
                type: "inside",
            },
            {
            },
        ],
        series: [
            {
                name: nameSeries,
                type: "line",
                smooth: true,
                symbol: "none",
                areaStyle: {},
                data: data,
            },
        ],
    }), [data, title, nameSeries]);

    return (
        <EChart
            option={option}
            height={
                Platform.OS === "web"
                    ? height
                    : Dimensions.get("window").height
            }
            onDataZoom={onZoomChange}
        />
    );
}
