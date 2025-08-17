<template>
    <el-card
        class="living-tag-cloud"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <div class="title">
            <span>标签云</span>
            <el-icon
                v-if="overflow"
                size="16"
                class="expand-btn"
                @click="expanded = !expanded"
            >
                <ArrowDown v-if="!expanded" />
                <ArrowUp v-else />
            </el-icon>
        </div>

        <!-- 标签列表 -->
        <div class="tag-list" :class="{ expanded }" ref="tagListEl">
            <span
                v-for="item in tagCloudArray"
                :key="item.tag"
                class="tag"
                :class="item.type"
                :style="fontStyle(item.ratio)"
                @click="handleSearchJumps(item.tag)"
            >
                {{ item.tag }}
                <sup>{{ item.number }}</sup>
            </span>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { type ArticleTag, articleTags } from "@/api/article";

/* ---------- 数据 ---------- */
const tagTypes = ["primary", "success", "info", "warning", "danger"] as const;
interface TagCloudItem {
    tag: string;
    number: number;
    type: string;
    ratio: number;
}
const tagCloudArray = ref<TagCloudItem[]>([]);

const getTagCloudArray = async () => {
    const res = await articleTags();
    if (res.code === 0) {
        const list = res.data;
        const max = Math.max(...list.map((i) => i.number), 1);
        tagCloudArray.value = list.map((item, idx) => ({
            tag: item.tag,
            number: item.number,
            type: tagTypes[idx % tagTypes.length],
            ratio: Math.min(item.number / max, 1),
        }));
        /* 计算是否溢出 */
        await nextTick();
        checkOverflow();
    }
};
getTagCloudArray();

/* ---------- 展开/折叠 ---------- */
const tagListEl = ref<HTMLElement>();
const overflow = ref(false);
const expanded = ref(false);
const checkOverflow = () => {
    if (!tagListEl.value) return;
    overflow.value =
        tagListEl.value.scrollHeight > tagListEl.value.clientHeight;
};

/* ---------- 字体大小 14-28 px ---------- */
const fontStyle = (ratio: number) => ({
    fontSize: `${14 + ratio * 14}px`,
});

/* ---------- 搜索跳转 ---------- */
const handleSearchJumps = (tag: string) => {
    window.open("/search?tag=" + encodeURIComponent(tag));
};

/* ---------- hover 状态 ---------- */
const hover = ref(false);
</script>

<style scoped lang="scss">
.living-tag-cloud {
    margin-top: 20px;
    --radius: 16px;
    position: relative;
    overflow: hidden;
    border-radius: var(--radius);
    padding: 20px;
    font-size: 14px;
    color: #2c3e50;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    transition:
        transform 0.4s,
        box-shadow 0.4s;

    &:hover {
        transform: perspective(800px) rotateY(-3deg) scale(1.02);
        box-shadow: 0 12px 24px rgba(64, 158, 255, 0.28);
    }

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #303133;
        .expand-btn {
            cursor: pointer;
            transition: transform 0.2s;
            &:hover {
                transform: scale(1.2);
            }
        }
    }

    /* 标签列表，2 行高度 */
    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 100px; /* 2 行 ≈ 36px * 2 */
        overflow: hidden;
        transition: max-height 0.3s ease;
        &.expanded {
            max-height: 1000px;
        }

        .tag {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 14px;
            cursor: pointer;
            color: #fff;
            transition:
                transform 0.25s,
                box-shadow 0.25s;
            user-select: none;
            sup {
                margin-left: 3px;
                font-size: 10px;
                opacity: 0.8;
            }
            &:hover {
                transform: scale(1.08) rotate(-8deg);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            /* 五种主题色 */
            &.primary {
                background: linear-gradient(135deg, #409eff, #66b1ff);
            }
            &.success {
                background: linear-gradient(135deg, #67c23a, #85ce61);
            }
            &.info {
                background: linear-gradient(135deg, #909399, #a6a9ad);
            }
            &.warning {
                background: linear-gradient(135deg, #e6a23c, #ebb563);
            }
            &.danger {
                background: linear-gradient(135deg, #f56c6c, #f78989);
            }
        }
    }
}
</style>
