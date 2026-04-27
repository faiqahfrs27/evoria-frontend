import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../stores/useAuth";

export function useGoogleAuth() {
  const setAuth = useAuth((s) => s.login);
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (accessToken: string) => {
      const res = await axiosInstance.post("/auth/google", {
        accessToken, 
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);

      toast.success(`Selamat datang, ${data.user.name.split(" ")[0]}!`);

      if (data.user.role === "ORGANIZER") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Google login gagal!");
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      await mutateAsync(response.access_token);
    },
    onError: () => toast.error("Google login dibatalkan."),
  });

  return { handleGoogleLogin, isPending };
}
