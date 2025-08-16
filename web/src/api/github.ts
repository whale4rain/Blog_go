import type { DateItem } from "@/components/contribute/core";
import axios from "axios";

export interface HeatCell {
  date: string; // yyyy-MM-dd
  level: number; // 0-4
}

/** 拉取指定年份的数据 */
export async function fetchGitHubHeatmap(
  ghUser: string,
  year: number,
): Promise<Record<string, DateItem & { level?: number }>> {
  const { data } = await axios.get<HeatCell[]>(
    `/api/base/github/${ghUser}/heatmap/${year}`,
  );
  // 转成前端需要的 Map 结构
  return data.reduce<Record<string, DateItem & { level?: number }>>((m, c) => {
    m[c.date] = {
      year: +c.date.slice(0, 4),
      month: +c.date.slice(5, 7),
      date: +c.date.slice(8, 10),
      day: 0, // day 值后端不需要给
      full: c.date,
      level: c.level,
    };
    return m;
  }, {});
}
