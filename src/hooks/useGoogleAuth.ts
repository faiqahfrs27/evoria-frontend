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
        credential: accessToken,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success(`Selamat datang, ${data.user.fullName.split(" ")[0]}!`);
      navigate("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Google login gagal!");
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => mutateAsync(response.access_token),
    onError: () => toast.error("Google login dibatalkan."),
  });

  return { handleGoogleLogin, isPending };
}