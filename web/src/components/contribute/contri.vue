<template>
    <el-card class="contribute-chart">
        <h1>ContributionChart</h1>

        <!-- <h3>DEFAULT</h3>
    <Chart :dataSources="mockData" show-footer :description="'Description: Contribution-Chart'" /> -->

        <!-- <h3>YEAR: 2021</h3>
    <Chart :data-sources="mockData" :year="year" /> -->
        <h3>RANGE: {{ startDate }} - {{ endDate }}</h3>
        <Chart
            :data-sources="heatMap"
            :start-date="startDate"
            :end-date="endDate"
        />
    </el-card>
</template>

<script setup lang="ts">
import { fetchGitHubHeatmap } from "@/api/github";
import { onMounted, ref } from "vue";
import { type DateItem } from "./core";
import Chart from "./index.vue";
const year = 2025;
const startDate = "2025-03-1";
const endDate = "2026-01-1";

const heatMap = ref<Record<string, DateItem & { level?: number }>>({});
onMounted(async () => {
    heatMap.value = await fetchGitHubHeatmap("whale4rain", 2025);
});
// const mockData = generateChartData("2025-03-1", "2026-01-1")
//   .dates.flat()
//   .reduce<Record<string, DateItem & { level?: number }>>((prev, item) => {
//     return { ...prev, [item.full]: { ...item, level: Math.round(Math.random() * 3) } };
//   }, {});
</script>
<style scoped>
.contribute-chart {
    padding: 16px;

    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h1 {
    padding: 8px 12px;
    background-color: #0058f9;
    color: #fff;
    border-radius: 8px;
    font-size: 18px;
}
h3 {
    color: #666;
    font-size: 14px;
    padding: 4px 10px;
    margin-top: 50px;
    background-color: #efefef;
}
</style>
