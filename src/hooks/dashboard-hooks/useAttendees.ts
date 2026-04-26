import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export const useAttendees = (eventId: string | null) =>
  useQuery({
    queryKey: ["dashboard", "attendees", eventId],
    queryFn: async () =>
      (await axiosInstance.get(`/dashboard/events/${eventId}/attendees`)).data.data,
    enabled: !!eventId,
  });