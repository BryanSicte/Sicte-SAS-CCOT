import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";

export default function EChart({ option, height = 300, onDataZoom }) {
    const chartRef = useRef(null);

    if (Platform.OS !== "web") {
        const chartHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <style>
                        html, body, #chart {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                    </style>
                    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
                </head>
                <body>
                    <div id="chart"></div>

                    <script>
                        const chart = echarts.init(document.getElementById('chart'));
                        const option = ${JSON.stringify(option)};

                        chart.setOption(option);

                        // 🔥 Escuchar event dataZoom y enviar a React Native
                        chart.on('dataZoom', function () {
                            const xAxis = chart.getModel().getComponent('xAxis').axis;
                            const extent = xAxis.scale.getExtent();

                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: "dataZoom",
                                start: extent[0],
                                end: extent[1]
                            }));
                        });
                    </script>
                </body>
            </html>
        `;

        return (
            <WebView
                originWhitelist={["*"]}
                source={{ html: chartHtml }}
                style={{ height }}
                onMessage={(event) => {
                    try {
                        const msg = JSON.parse(event.nativeEvent.data);
                        if (msg.type === "dataZoom" && onDataZoom) {
                            onDataZoom({ start: msg.start, end: msg.end });
                        }
                    } catch (e) {
                        console.warn("Invalid message from WebView", e);
                    }
                }}
            />
        );
    }

    useEffect(() => {
        function initChart() {
            const echarts = window.echarts;
            if (!echarts || !chartRef.current) return;

            const chart = echarts.init(chartRef.current);
            chart.setOption(option);

            chart.on("dataZoom", () => {
                const xAxis = chart.getModel().getComponent("xAxis").axis;
                const extent = xAxis.scale.getExtent();

                if (onDataZoom) {
                    onDataZoom({
                        start: extent[0],
                        end: extent[1]
                    });
                }
            });
        }

        if (window.echarts) {
            initChart();
            return;
        }

        const script = document.createElement("script");
        script.id = "echarts-cdn";
        script.src = "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
        script.onload = initChart;
        document.body.appendChild(script);
    }, [option]);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height,
            }}
        />
    );
}
