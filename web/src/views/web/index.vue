<template>
    <div class="web">
        <el-container>
            <router-view />
            <el-footer>
                <div class="breathing-divider" />
                <web-footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import WebFooter from "@/components/layout/WebFooter.vue";
</script>

<style scoped lang="scss">
.web {
    .el-footer {
        --text-color: #2c3e50;
        --bg-gradient: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        --hover-shadow: 0 8px 24px rgba(64, 158, 255, 0.18);

        position: relative;
        color: var(--text-color);
        background: var(--bg-gradient);
        padding: 0; /* 关键：让分割线贴边 */
        transition:
            transform 0.4s,
            box-shadow 0.4s;

        /* 1. 顶部呼吸分割线 */
        .breathing-divider {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #42a5f5, #ab47bc);
            animation: breathing 3s infinite;
            z-index: 1;
        }

        @keyframes breathing {
            0% {
                opacity: 0.4;
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0.4;
            }
        }
    }
}
</style>
