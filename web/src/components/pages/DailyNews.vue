<template>
    <el-card
        class="living-daily-news"
        :class="{ hovered }"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
    >
        <div class="title">每日新闻</div>

        <!-- 滚动彩条 -->
        <div class="glow-bar" />

        <el-tabs v-model="activeTab" @tab-click="handleNewsTabClick">
            <el-tab-pane
                v-for="item in newsTypeList"
                :key="item.name"
                :name="item.name"
            >
                <template #label>
                    <div class="tab-label">
                        <el-image :src="item.src" class="tab-icon" />
                        <span>{{ item.label }}</span>
                    </div>
                </template>

                <!-- 新闻列表 -->
                <ul class="news-list">
                    <li
                        v-for="(row, idx) in newsTableData"
                        :key="row.index"
                        class="news-item"
                        @click="handleNewsTableClick(row)"
                    >
                        <span class="index">{{ idx + 1 }}</span>
                        <span class="title-text">{{ row.title }}</span>
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>

        <div class="tip">
            仅展示前 7 条，更多请前往
            <el-link href="/news" class="link">新闻频道</el-link>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { TabsPaneContext } from "element-plus";
import type { HotItem, WebsiteNewsRequest } from "@/api/website";
import { websiteNews } from "@/api/website";

/* ---------- 数据 ---------- */
const newsTableData = ref<HotItem[]>([]);
const activeTab = ref("baidu");

interface NewsTypeItem {
    name: string;
    label: string;
    src: string;
}
const newsTypeList: NewsTypeItem[] = [
    { name: "baidu", label: "百度热搜", src: "/image/baidu.png" },
    { name: "zhihu", label: "知乎热榜", src: "/image/zhihu.png" },
    { name: "kuaishou", label: "快手热榜", src: "/image/kuaishou.png" },
    { name: "toutiao", label: "头条热榜", src: "/image/toutiao.png" },
];

const cache = new Map<string, HotItem[]>();

const loadNews = async (source: string) => {
    if (!cache.has(source)) {
        const req: WebsiteNewsRequest = { source };
        const res = await websiteNews(req);
        if (res.code === 0) cache.set(source, res.data.hot_list.slice(0, 7));
    }
    newsTableData.value = cache.get(source) ?? [];
};

const handleNewsTabClick = (tab: TabsPaneContext) =>
    loadNews(tab.paneName as string);
const handleNewsTableClick = (item: HotItem) => {
    window.open(item.url);
};
/* ---------- 悬停状态 ---------- */
const hovered = ref(false);

onMounted(() => loadNews(activeTab.value));
</script>

<style scoped lang="scss">
.living-daily-news {
    margin-top: 20px;
    --radius: 16px;
    position: relative;
    border-radius: var(--radius);
    padding: 20px;
    color: #2c3e50;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    transition:
        transform 0.4s,
        box-shadow 0.4s;

    &.hovered {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(64, 158, 255, 0.18);
    }

    .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
    }

    /* 顶部滚动彩条 */
    .glow-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 0;
        background: linear-gradient(90deg, #42a5f5, #ab47bc);
        animation: slide 2.5s infinite;
        @keyframes slide {
            0% {
                width: 0;
                left: 0;
            }
            50% {
                width: 100%;
                left: 0;
            }
            100% {
                width: 0;
                left: 100%;
            }
        }
    }

    /* 自定义标签栏 */
    :deep(.el-tabs__nav-wrap::after) {
        display: none;
    }
    :deep(.el-tabs__item) {
        padding: 0 12px;
        font-size: 13px;
        color: #606266;
        &.is-active {
            color: #409eff;
        }
    }

    .tab-label {
        display: flex;
        align-items: center;
        gap: 4px;
        .tab-icon {
            width: 16px;
            height: 16px;
        }
    }

    /* 新闻列表 */
    .news-list {
        margin: 0;
        padding: 0;
        list-style: none;
        .news-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
            &:hover {
                background: rgba(64, 158, 255, 0.05);
            }
            .index {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                border-radius: 50%;
                background: #409eff;
                color: #fff;
                font-size: 12px;
            }
            .title-text {
                flex: 1;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 14px;
                line-height: 1.4;
            }
        }
    }

    .tip {
        margin-top: 12px;
        font-size: 12px;
        color: #909399;
        .link {
            margin-left: 4px;
        }
    }
}
</style>
