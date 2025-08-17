<template>
    <div class="article-show">
        <!-- 首屏骨架屏 -->
        <template v-if="loading && !articles.length">
            <ArticleSkeleton v-for="i in 4" :key="i" />
        </template>

        <!-- 两列瀑布流 -->
        <div class="masonry">
            <article
                v-for="art in articles"
                :key="art._id"
                class="article-card"
                @click="jump(art._id)"
            >
                <el-image
                    :src="art._source.cover"
                    class="cover"
                    fit="cover"
                    lazy
                />
                <div class="meta">
                    <h2 class="title">{{ art._source.title }}</h2>
                    <p class="abstract">{{ art._source.abstract }}</p>
                    <div class="foot">
                        <span>{{ art._source.created_at }}</span>
                        <span>
                            <el-icon><View /></el-icon>
                            {{ art._source.views }}
                        </span>
                    </div>
                </div>
            </article>
        </div>

        <!-- 无限滚动触发器 -->
        <div ref="trigger" class="trigger"></div>

        <!-- 加载更多骨架屏 -->
        <ArticleSkeleton v-if="loading && articles.length" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Hit } from "@/api/common";
import type { Article, ArticleSearchRequest } from "@/api/article";
import { articleSearch } from "@/api/article";

/* -------------------- 数据 -------------------- */
const articles = ref<Hit<Article>[]>([]);
const page = ref(1);
const pageSize = 12;
const loading = ref(false);
const noMore = ref(false);

const fetch = async () => {
    if (noMore.value) return;
    loading.value = true;
    const request: ArticleSearchRequest = {
        query: "",
        category: "",
        tag: "",
        sort: "time",
        order: "desc",
        page: page.value,
        page_size: pageSize,
    };
    const res = await articleSearch(request);
    if (res.code === 0) {
        articles.value.push(...res.data.list);
        noMore.value = res.data.list.length < pageSize;
    }
    loading.value = false;
};

/* 无限滚动 */
const trigger = ref<HTMLElement>();
let observer: IntersectionObserver;
onMounted(() => {
    fetch();
    observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !loading.value && !noMore.value) {
                page.value++;
                fetch();
            }
        },
        { threshold: 0.1 },
    );
    observer.observe(trigger.value!);
});
onUnmounted(() => observer?.disconnect());

const jump = (id: string) => {
    window.open(`/article/${id}`);
};
</script>

<!-- 骨架屏子组件（单文件内联） -->
<script lang="ts">
import { defineComponent } from "vue";
export const ArticleSkeleton = defineComponent({
    name: "ArticleSkeleton",
    setup() {},
    template: `
    <div class="skeleton">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="image" style="height:200px;border-radius:12px" />
          <div style="padding:16px 0">
            <el-skeleton-item variant="h3" style="width:60%" />
            <el-skeleton-item variant="text" style="margin-top:8px" />
            <el-skeleton-item variant="text" style="width:80%" />
          </div>
        </template>
      </el-skeleton>
    </div>
  `,
});
</script>

<style scoped>
.skeleton {
    margin-bottom: 24px;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>

<style scoped lang="scss">
.article-show {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 16px;
}

/* 两列瀑布流 */
.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 24px;
}

.article-card {
    color: #2c3e50;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    transition:
        transform 0.4s,
        box-shadow 0.4s;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .cover {
        width: 100%;
        aspect-ratio: 16 / 10;
        display: block;
    }

    .meta {
        padding: 20px 24px;
        .title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #303133;
        }
        .abstract {
            font-size: 14px;
            line-height: 1.5;
            color: #606266;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .foot {
            font-size: 13px;
            color: #909399;
            display: flex;
            justify-content: space-between;
        }
    }
}

.trigger {
    height: 1px;
}
</style>
