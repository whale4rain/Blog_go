<template>
    <div class="carousel">
        <el-carousel trigger="click" height="700px">
            <el-carousel-item v-for="item in imgList" :key="item">
                <el-image fit="cover" :src="item" alt=""></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup lang="ts">
import { websiteCarousel } from "@/api/website";
import { ref } from "vue";

const imgList = ref<string[]>([
    "/image/carousel_1.jpg",
    "/image/carousel_2.jpg",
    "/image/carousel_3.jpg",
]);

const getWebsiteCarousel = async () => {
    const res = await websiteCarousel();
    if (res.code === 0 && res.data.length !== 0) {
        imgList.value = res.data;
    }
};

getWebsiteCarousel();
</script>

<style scoped lang="scss">
.carousel {
    --radius: 16px;
    --hover-shadow: 0 12px 32px rgba(64, 158, 255, 0.22);
    --transition: transform 0.4s, box-shadow 0.4s;

    width: 100%;
    padding: 0 16px; /* 给左右留一点呼吸空间 */
    position: relative;

    .el-carousel {
        border-radius: var(--radius);
        overflow: hidden; /* 圆角裁切 */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: var(--transition);
        &:hover {
            transform: translateY(-2px);
            box-shadow: var(--hover-shadow);
        }

        /* 让图片填满圆角框 */
        .el-image {
            width: 100%;
            height: 100%;
            border-radius: var(--radius);
            transition: var(--transition);
        }
    }

    /* 指示器颜色统一柔和蓝 */
    :deep(.el-carousel__indicators) {
        bottom: 16px;
        .el-carousel__indicator {
            .el-carousel__button {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                width: 8px;
                height: 8px;
                transition: background 0.3s;
            }
            &.is-active .el-carousel__button {
                background: #409eff;
            }
        }
    }
}
</style>
