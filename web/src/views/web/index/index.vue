<template>
    <div class="index">
        <web-navbar />
        <carousel />
        <el-container class="main-content">
            <div class="container">
                <el-aside>
                    <profile-card />
                    <daily-news />
                </el-aside>
                <el-main>
                    <article-list />
                </el-main>

                <el-aside>
                    <calendar />

                    <tag-cloud />
                    <recent-comments />
                    <feedback />
                </el-aside>
            </div>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import Carousel from "@/components/layout/Carousel.vue";
import WebNavbar from "@/components/layout/WebNavbar.vue";

import ArticleList from "@/components/pages/ArticleList.vue";
import Calendar from "@/components/pages/Calendar.vue";
import DailyNews from "@/components/pages/DailyNews.vue";
import Feedback from "@/components/pages/Feedback.vue";
import ProfileCard from "@/components/pages/ProfileCard.vue";
import RecentComments from "@/components/pages/RecentComments.vue";
import TagCloud from "@/components/pages/TagCloud.vue";
</script>

<style scoped lang="scss">
.index {
    .main-content {
        display: flex;
        justify-content: center;

        .container {
            display: flex;
            max-width: 95%; //1400px;
            width: 100%;

            .el-main {
                width: 70%;
            }

            .el-aside {
                width: 20%;
                padding: 20px;
            }
        }
    }
}
</style>
