<template>
    <div :class="{ 'web-navbar': true, show: true }">
        <div class="container">
            <logo />
            <div class="web-menu">
                <el-menu
                    mode="horizontal"
                    :ellipsis="false"
                    :router="true"
                    :default-active="$route.path"
                >
                    <template v-for="item in menuList">
                        <el-menu-item :index="item.name"
                            ><span>{{ item.title }}</span></el-menu-item
                        >
                    </template>
                </el-menu>
            </div>
            <auth-popover />
        </div>
    </div>
</template>

<script setup lang="ts">
import AuthPopover from "@/components/common/AuthPopover.vue";
import Logo from "@/components/widgets/Logo.vue";
import { ref } from "vue";
import { onUnmounted } from "vue";

const isShow = ref(true);

const props = defineProps<{
    noScroll?: boolean;
}>();

if (!props.noScroll) {
    isShow.value = false;
    window.addEventListener("scroll", scroll);
    scroll();
}

function scroll() {
    let top = document.documentElement.scrollTop;
    isShow.value = top >= 100;
}

onUnmounted(() => {
    if (!props.noScroll) {
        window.removeEventListener("scroll", scroll);
    }
});

interface MenuItem {
    title: string;
    name: string;
}

const menuList: MenuItem[] = [
    {
        title: "首页",
        name: "/",
    },
    {
        title: "搜索",
        name: "/search",
    },
    {
        title: "新闻",
        name: "/news",
    },
    {
        title: "友链",
        name: "/friend-link",
    },
    {
        title: "关于",
        name: "/about",
    },
];
</script>

<style scoped lang="scss">
.web-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 6;

    /* 默认隐藏（滚动前） */
    transform: translateY(-100%);
    transition:
        transform 0.35s ease,
        background-color 0.35s ease,
        box-shadow 0.35s ease;

    /* 滚动 100px 后显现 */
    &.show {
        transform: translateY(0);
        background-color: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .container {
        display: flex;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
        height: 68px; /* 统一高度，防止抖动 */
    }

    /* 菜单字体、颜色 */
    .web-menu {
        margin-left: 32px;
        .el-menu {
            background-color: transparent;
            border: none;
            --el-menu-item-font-size: 20px;
            --el-menu-text-color: #303133;
            --el-menu-hover-text-color: #409eff;
            --el-menu-active-color: #409eff;
            --el-menu-item-height: 68px;
            --el-menu-horizontal-sub-item-height: 68px;

            .el-menu-item {
                border-bottom: none !important;
                background-color: transparent;
                transition: color 0.25s ease;

                &:hover,
                &:focus {
                    background-color: transparent;
                }

                &.is-active {
                    font-weight: 600;
                }
            }
        }
    }

    /* Logo 区域 */
    .logo {
        flex-shrink: 0;
        height: 44px;
        width: auto;
    }

    /* 右侧登录/头像按钮 */
    .auth-popover {
        margin-left: auto;
        flex-shrink: 0;
    }
}
</style>
