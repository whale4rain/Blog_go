<template>
    <div class="article-publish">
        <div class="title">
            <div class="left">
                <el-form :inline="true">
                    <el-form-item label="文章标题">
                        <el-input
                            v-model="title"
                            placeholder="请输入文章标题"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            :loading="aiLoading"
                            @click="handleAiGenerate"
                        >
                            ✨ AI 一键生成相关数据
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- AI 结果预览弹窗 -->
            <el-dialog v-model="aiVisible" title="AI 建议" width="480">
                <el-form label-width="60">
                    <el-form-item label="标题">
                        <el-input v-model="aiResult.title" />
                    </el-form-item>
                    <el-form-item label="摘要">
                        <el-input
                            v-model="aiResult.summary"
                            type="textarea"
                            :rows="3"
                        />
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select
                            v-model="aiResult.category"
                            type="textarea"
                            :rows="3"
                        />
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select
                            v-model="aiResult.tags"
                            multiple
                            filterable
                            allow-create
                            placeholder="选择或创建"
                        />
                    </el-form-item>
                </el-form>

                <template #footer>
                    <el-button @click="aiVisible = false">取消</el-button>
                    <el-button type="primary" @click="applyAiResult"
                        >应用</el-button
                    >
                </template>
            </el-dialog>
            <div class="right">
                <el-text>自动保存</el-text>
                <el-switch v-model="isAutoSaveEnabled" />
                <el-button
                    type="danger"
                    icon="Delete"
                    @click="
                        title = '';
                        text = '';
                    "
                    >清空文章</el-button
                >
                <el-button
                    type="success"
                    icon="Plus"
                    @click="layoutStore.state.articleCreateVisible = true"
                    >发布文章</el-button
                >

                <!--  这里必须销毁，不然不会重新加载props-->
                <el-dialog
                    v-model="articleCreateVisible"
                    width="500"
                    align-center
                    destroy-on-close
                    :before-close="articleCreateVisibleSynchronization"
                >
                    <template #header> 发布文章 </template>
                    <article-create-form
                        :title="title"
                        :content="text"
                        :ai-meta="aiMeta"
                    />
                    <template #footer> </template>
                </el-dialog>
            </div>
        </div>
        <MdEditor
            v-model="text"
            @onUploadImg="onUploadImg"
            @onSave="onSave"
            @onChange="onChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import axios from "axios";
import { useLayoutStore } from "@/stores/layout";
import ArticleCreateForm from "@/components/forms/ArticleCreateForm.vue";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/utils/request";
import type { ImageUploadResponse } from "@/api/image";

const layoutStore = useLayoutStore();

const savedIsAutoSaveEnabled = localStorage.getItem("isAutoSaveEnabled");
const isAutoSaveEnabled = savedIsAutoSaveEnabled
    ? ref(savedIsAutoSaveEnabled === "true")
    : ref(true);
watch(
    () => isAutoSaveEnabled.value,
    (newIsAutoSaveEnabled) => {
        localStorage.setItem("isAutoSaveEnabled", String(newIsAutoSaveEnabled));
    },
);

const title = ref("");
const savedArticle = localStorage.getItem("article");
const text = savedArticle ? ref(savedArticle) : ref("");

const onUploadImg = async (
    files: File[],
    callback: (urls: string[]) => void,
): Promise<void> => {
    const res = await Promise.all(
        files.map((file) => {
            return new Promise<AxiosResponse<ApiResponse<ImageUploadResponse>>>(
                (resolve, reject) => {
                    const form = new FormData();
                    form.append("image", file);

                    axios
                        .post("/api/image/upload", form, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                            withCredentials: true,
                        })
                        .then((response) => resolve(response))
                        .catch((error) => reject(error));
                },
            );
        }),
    );

    callback(res.map((item) => item.data.data.url));
};

const onSave = (v: string, _: Promise<string>): void => {
    localStorage.setItem("article", v);
};

const onChange = (v: string): void => {
    if (isAutoSaveEnabled.value) {
        onSave(v, Promise.resolve(""));
    }
};

const articleCreateVisible = ref(layoutStore.state.articleCreateVisible);
watch(
    () => layoutStore.state.articleCreateVisible,
    (newValue) => {
        articleCreateVisible.value = newValue;
    },
);

const articleCreateVisibleSynchronization = () => {
    layoutStore.state.articleCreateVisible = false;
};

import { reactive } from "vue";

const props = defineProps<{ title: string; content: string }>();
const form = reactive({
    title: props.title,
    summary: "",
    category: "",
    tags: [] as string[],
});

const aiLoading = ref(false);
const aiVisible = ref(false);

const aiResult = reactive({
    title: "",
    summary: "",
    category: "",
    tags: [] as string[],
});

const aiMeta = ref({
    title: "",
    summary: "",
    category: "",
    tags: [] as string[],
});
import { ElMessage } from "element-plus";
async function handleAiGenerate() {
    if (!text.value.trim()) {
        ElMessage.warning("请先写正文");
        return;
    }
    aiLoading.value = true;
    try {
        const { data } = await axios.post("/api/ai/generate-meta", {
            title: title.value, // 当前标题
            content: text.value, // ← 实时全文
        });
        Object.assign(aiResult, data);
        aiVisible.value = true;
    } finally {
        aiLoading.value = false;
    }
}

function applyAiResult() {
    // 回填到主表单
    form.title = aiResult.title;
    form.summary = aiResult.summary;
    form.category = aiResult.category;
    form.tags = aiResult.tags;
    aiMeta.value = {
        title: aiResult.title ?? "",
        category: aiResult.category ?? "",
        tags: aiResult.tags ?? [],
        summary: aiResult.summary ?? "",
    };
    aiVisible.value = false;
}
</script>

<style lang="scss">
.article-publish {
    height: 100%;

    .title {
        display: flex;

        .left {
            .el-input {
                min-width: 400px;
            }
        }

        .right {
            margin-left: auto;

            .el-switch {
                margin-left: 20px;
                margin-right: 20px;
            }
        }
    }

    .md-editor {
        height: 95%;
    }
}
</style>

<style lang="scss">
.article-publish
    .md-editor
    .md-editor-toolbar-wrapper
    .md-editor-toolbar
    svg.md-editor-icon {
    height: 24px;
    width: 24px;
}
</style>
