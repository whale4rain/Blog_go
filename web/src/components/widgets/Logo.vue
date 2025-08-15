<template>
    <div class="logo">
        <el-image
            :src="
                websiteStore.state.websiteInfo.logo === ''
                    ? '/image/logo.png'
                    : websiteStore.state.websiteInfo.logo
            "
            alt=""
        />
        <div class="brand-info">
            <div>{{ websiteStore.state.websiteInfo.slogan }}</div>
            <div>{{ websiteStore.state.websiteInfo.slogan_en }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWebsiteStore } from "@/stores/website";

const websiteStore = useWebsiteStore();
</script>

<style scoped lang="scss">
$logo-size--normal: 60px;
$logo-size--collapsed: 44px;
$brand-gap: 20px;

.logo {
    display: flex;
    align-items: center;
    padding: 10px;

    /* 图片 */
    .el-image {
        width: $logo-size--normal;
        height: $logo-size--normal;
        object-fit: contain; /* 保持比例，防止拉伸 */
        padding: 5px;
    }

    /* 品牌文案 */
    .brand-info {
        display: flex;
        flex-direction: column;
        justify-content: center;

        &__cn {
            font-size: 24px;
            line-height: 1.2;
        }

        &__en {
            font-size: 13px;
            line-height: 1.2;
        }
    }

    &--collapsed {
        .el-image {
            display: none;
        }

        .brand-info {
            display: none;
        }
    }
}

.web-navbar .logo {
    /* 导航条下，图片再小一点 */
    .el-image {
        border-radius: 20px;
        display: flex;
    }

    /* 导航条下，文字再小一点 */
    .brand-info {
        &__cn {
            font-size: 0px;
        }
        &__en {
            font-size: 0px;
        }
    }
}
</style>
