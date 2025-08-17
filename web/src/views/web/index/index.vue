<template>
    <div class="index">
        <web-navbar />
        <carousel />

        <el-container class="main-content">
            <el-row :gutter="24" class="container">
                <!-- 主内容 17 份 -->
                <el-col :xs="24" :lg="17">
                    <article-list />
                </el-col>

                <!-- 侧边栏 7 份 -->
                <el-col :xs="24" :lg="7">
                    <calendar />
                    <tag-cloud />

                    <daily-news />
                </el-col>
            </el-row>
        </el-container>
    </div>
</template>

<style scoped lang="scss">
.index {
    color: #2c3e50;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    transition:
        transform 0.4s,
        box-shadow 0.4s;
}
.main-content {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}
.container {
    width: 95%;
    max-width: 1400px;
}
</style>
