<template>
    <el-card
        class="living-calendar"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- 彩条倒计时 -->
        <div class="countdown-bar" :style="{ width: nextTermPercent + '%' }" />

        <!-- 主信息 -->
        <div class="main-grid">
            <!-- 公历大日期 -->
            <div class="day-box">
                <span class="day">{{ day }}</span>
                <span class="month">{{ month }} 月</span>
            </div>

            <!-- 农历/节气 -->
            <div class="info">
                <div class="lunar">
                    <span>{{ calendarInfo.lunar_date }}</span>
                    <span class="divider">·</span>
                    <span>{{ calendarInfo.zodiac }}</span>
                </div>
                <div class="term">{{ calendarInfo.solar_term }}</div>
            </div>
        </div>

        <!-- 宜 -->
        <div class="section yi">
            <span class="label">宜</span>
            <div class="tags">
                <span v-for="t in yiShow" :key="t" class="tag">{{ t }}</span>
                <span v-if="yiRest" class="more">+{{ yiRest }}</span>
            </div>
        </div>

        <!-- 忌 -->
        <div class="section ji">
            <span class="label">忌</span>
            <div class="tags">
                <span v-for="t in jiShow" :key="t" class="tag">{{ t }}</span>
                <span v-if="jiRest" class="more">+{{ jiRest }}</span>
            </div>
        </div>

        <!-- 悬停动效层 -->
        <div class="float-layer" :class="{ active: hover }" />
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { websiteCalendar, type WebsiteCalendarResponse } from "@/api/website";

/* 数据 */
const calendarInfo = ref<WebsiteCalendarResponse>({
    date: "",
    lunar_date: "",
    ganzhi: "",
    zodiac: "",
    day_of_year: "",
    solar_term: "",
    auspicious: "",
    inauspicious: "",
});
const getCalendarInfo = async () => {
    const res = await websiteCalendar();
    if (res.code === 0) calendarInfo.value = res.data;
};
getCalendarInfo();

/* 日期 */
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;

/* 宜/忌截取 */
const MAX = 6;
const yiList = computed(
    () => calendarInfo.value.auspicious?.split(/\s+/) || [],
);
const jiList = computed(
    () => calendarInfo.value.inauspicious?.split(/\s+/) || [],
);
const yiShow = computed(() => yiList.value.slice(0, MAX));
const yiRest = computed(() => Math.max(0, yiList.value.length - MAX));
const jiShow = computed(() => jiList.value.slice(0, MAX));
const jiRest = computed(() => Math.max(0, jiList.value.length - MAX));

/* 节气倒计时百分比（mock：立秋共 15 天） */
const termDay = computed(() => {
    const m = calendarInfo.value.solar_term?.match(/第(\d+)天/);
    return m ? Number(m[1]) : 0;
});
const nextTermPercent = computed(() => (termDay.value / 15) * 100);

/* 悬停状态 */
const hover = ref(false);
</script>

<style scoped lang="scss">
.living-calendar {
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

    /* 顶部倒计时彩条 */
    .countdown-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #42a5f5, #ab47bc);
        transition: width 0.5s;
    }

    /* 主信息网格 */
    .main-grid {
        display: grid;
        grid-template-columns: 76px 1fr;
        gap: 12px;
        align-items: center;
        margin-bottom: 14px;
    }

    .day-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .day {
            font-size: 44px;
            font-weight: 700;
            color: #409eff;
            line-height: 1;
        }
        .month {
            font-size: 12px;
            color: #7e57c2;
        }
    }

    .info {
        .lunar {
            font-size: 15px;
            font-weight: 500;
            .divider {
                margin: 0 6px;
                color: #bbb;
            }
        }
        .term {
            margin-top: 4px;
            font-size: 12px;
            color: #ff7043;
        }
    }

    /* 宜/忌区块 */
    .section {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 8px;
        .label {
            font-weight: 600;
            width: 20px;
            flex-shrink: 0;
            color: #333;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            .tag {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                background: rgba(64, 158, 255, 0.12);
                color: #409eff;
            }
            .more {
                font-size: 12px;
                color: #999;
                align-self: center;
            }
        }
        &.ji .tag {
            background: rgba(245, 108, 108, 0.12);
            color: #f56c6c;
        }
    }

    /* 浮层呼吸灯 */
    .float-layer {
        position: absolute;
        inset: 0;
        border-radius: var(--radius);
        background: radial-gradient(
            circle at 50% 50%,
            transparent 60%,
            rgba(64, 158, 255, 0.1)
        );
        opacity: 0;
        transition: opacity 0.4s;
        pointer-events: none;
        &.active {
            opacity: 1;
        }
    }
}
</style>
