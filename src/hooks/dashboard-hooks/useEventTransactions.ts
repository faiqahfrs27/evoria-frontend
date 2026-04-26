import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export const useEventTransactions = (eventId: string | null) =>
  useQuery({
    queryKey: ["dashboard", "transactions", eventId],
    queryFn: async () =>
      (await axiosInstance.get(`/dashboard/events/${eventId}/transactions`)).data.data,
    enabled: !!eventId,
  });