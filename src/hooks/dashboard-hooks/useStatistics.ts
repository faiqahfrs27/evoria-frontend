import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import type { Period } from "../../components/utils/DashboardUtils";

export const useStatistics = (period: Period, year?: string, month?: string) =>
  useQuery({
    queryKey: ["dashboard", "statistics", period, year, month],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (year) params.set("year", year);
      if (month) params.set("month", month);
      return (await axiosInstance.get(`/dashboard/statistics?${params}`)).data.data;
    },
  });