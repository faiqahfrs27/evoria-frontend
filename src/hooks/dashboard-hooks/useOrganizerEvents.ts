import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export const useOrganizerEvents = () =>
  useQuery({
    queryKey: ["dashboard", "events"],
    queryFn: async () => (await axiosInstance.get("/dashboard/events")).data.data,
  });