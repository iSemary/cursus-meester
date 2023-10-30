"use client";
import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

function TopCoursesChart() {
    useEffect(() => {
        echarts.use([
            TitleComponent,
            TooltipComponent,
            LegendComponent,
            PieChart,
            CanvasRenderer,
            LabelLayout,
        ]);
        // Initialize ECharts instance
        const chart = echarts.init(document.getElementById("topCoursesChart"));
        // Chart options
        const options = {
            title: {
                text: "Top Courses",
                subtext: "Based On Enrolled Students",
                left: "center",
            },
            tooltip: {
                trigger: "item",
            },
            legend: {
                orient: "vertical",
                left: "left",
            },
            series: [
                {
                    name: "Access From",
                    type: "pie",
                    radius: "50%",
                    data: [
                        { value: 1048, name: "Search Engine" },
                        { value: 735, name: "Direct" },
                        { value: 580, name: "Email" },
                        { value: 484, name: "Union Ads" },
                        { value: 300, name: "Video Ads" },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };
        // Set options and render the chart
        chart.setOption(options);
        // Ensure the chart is resized with the window
        window.addEventListener("resize", () => {
            chart.resize();
        });
        return () => {
            // Clean up and dispose the chart when the component unmounts
            chart.dispose();
        };
    }, []);
    return (
        <div
            id="topCoursesChart"
            style={{ width: "100%", height: "400px" }}
        ></div>
    );
}
export default TopCoursesChart;
