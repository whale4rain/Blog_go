<template>
    <div class="skeleton">
        <el-skeleton animated>
            <template #template>
                <div
                    style="aspect-ratio: 16/9; border-radius: 16px"
                    class="skeleton-img"
                />
                <div style="padding: 20px 24px">
                    <el-skeleton-item variant="h1" style="width: 60%" />
                    <el-skeleton-item
                        variant="text"
                        style="margin-top: 8px; width: 90%"
                    />
                    <el-skeleton-item
                        variant="text"
                        style="margin-top: 4px; width: 80%"
                    />
                </div>
            </template>
        </el-skeleton>
    </div>
</template>

<style scoped>
.skeleton {
    margin-bottom: 32px;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
</style>
