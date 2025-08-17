<template>
    <div class="dashboard">
        <el-container>
            <el-aside :class="{ collapsed: isCollapse }">
                <logo />
                <dashboard-menu />
            </el-aside>
            <el-container>
                <el-header>
                    <div class="header-top">
                        <breadcrumb />
                        <div class="header-top-right">
                            <auth-popover />
                        </div>
                    </div>
                    <dashboard-tag />
                </el-header>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import Logo from "@/components/widgets/Logo.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import DashboardMenu from "@/components/layout/DashboardMenu.vue";
import { computed } from "vue";
import DashboardTag from "@/components/layout/DashboardTag.vue";
import AuthPopover from "@/components/common/AuthPopover.vue";
import { useLayoutStore } from "@/stores/layout";

const store = useLayoutStore();
const isCollapse = computed(() => store.state.isCollapse);
</script>

<style scoped lang="scss">
.dashboard {
    --radius: 16px;
    --hover-shadow: 0 8px 24px rgba(64, 158, 255, 0.18);
    --transition: transform 0.4s, box-shadow 0.4s;
    --text-color: #2c3e50;
    --bg-gradient: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    --aside-bg: #ffffff;
    --header-bg: #ffffff;

    color: var(--text-color);
    background: var(--bg-gradient);
    min-height: 100vh;

    .el-aside {
        background: var(--aside-bg);
        width: 240px;
        height: 100vh;
        border-right: none;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        border-radius: 0 var(--radius) var(--radius) 0;
        transition: width 0.3s;
        &::-webkit-scrollbar {
            display: none;
        }

        &.collapsed {
            width: 64px;
        }
    }

    .el-header {
        padding-top: 15px;
        background: var(--header-bg);
        height: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        overflow: hidden;

        .header-top {
            display: flex;
            align-items: center;
            padding: 0 20px;
            height: 56px;
            border-bottom: 1px solid #f0f0f0;

            .header-top-right {
                margin-left: auto;
                display: flex;
                align-items: center;
            }
        }
    }

    .el-main {
        padding: 24px;
        height: calc(100vh - 56px - 40px); /* 减去 header + 底部留白 */
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(64, 158, 255, 0.3);
            border-radius: 3px;
        }
    }
}
</style>
