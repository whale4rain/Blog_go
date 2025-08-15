<template>
    <el-card class="tag-cloud">
        <el-row class="title">标签云</el-row>

        <el-tag
            v-for="item in tagCloudArray"
            :key="item.tag"
            :type="item.type"
            size="large"
            effect="plain"
            :style="`--ratio:${item.ratio}`"
            @click="handleSearchJumps(item.tag)"
        >
            {{ item.tag }} {{ item.number }}
        </el-tag>
    </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type ArticleTag, articleTags } from "@/api/article";

const tagTypes = ["primary", "success", "info", "warning", "danger"];

interface TagCloudItem {
    tag: string;
    number: number;
    type: string;
    ratio: number; // 0~1 的热度权重
}

const tagCloudArray = ref<TagCloudItem[]>([]);

const getTagCloudArray = async () => {
    const res = await articleTags();
    if (res.code === 0) {
        const list = res.data;
        const max = Math.max(...list.map((i) => i.number)) || 1;
        tagCloudArray.value = list.map((item, idx) => ({
            tag: item.tag,
            number: item.number,
            type: tagTypes[idx % tagTypes.length],
            ratio: Math.min(item.number / max, 1),
        }));
    }
};

getTagCloudArray();

const handleSearchJumps = (tag: string) => {
    window.open("/search?tag=" + encodeURIComponent(tag));
};
</script>

<style scoped lang="scss">
.tag-cloud {
    --card-radius: 12px;
    --tag-gap: 12px;
    --tag-base: 10px; /* 最小字号 = el-tag large 14px */
    --tag-scale: 8px; /* 每 1 热度 ≈ 8px */

    border-radius: var(--card-radius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;
    padding: 8px;

    .title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 20px;
        letter-spacing: 1px;
    }

    /* 标签布局与动效 */
    ::v-deep(.el-tag) {
        margin: 0 var(--tag-gap) var(--tag-gap) 0;
        cursor: pointer;
        transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        user-select: none;

        &:hover {
            transform: scale(1.08);
            box-shadow: 0 4px 10px rgba(64, 158, 255, 0.25);
        }
    }

    /* 动态字号：14px ~ 28px */
    ::v-deep(.el-tag__content) {
        font-size: calc(var(--tag-base) + var(--tag-scale) * var(--ratio, 0));
    }
}
</style>
