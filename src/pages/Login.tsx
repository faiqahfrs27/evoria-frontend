import { loginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import AuthPanel from "../components/register/AuthPanel";
import FormField from "../components/register/FormField";
import GoldButton from "../components/register/GoldButton";
import { axiosInstance } from "../lib/axios";
import { fadeUp } from "../lib/animationStyle";
import { useAuth } from "../stores/useAuth";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import type { LoginSchema } from "../schemas/loginSchema";
import { useState } from "react";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

function Login() {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const { handleGoogleLogin, isPending: isGooglePending } = useGoogleAuth();
  const [showForgot, setShowForgot] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const rememberMe = watch("rememberMe");

  const { mutateAsync: loginMutation, isPending } = useMutation({
    mutationFn: async (payload: LoginSchema) => {
      const res = await axiosInstance.post("/auth/login", {
        email: payload.email,
        password: payload.password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      login(data.user);
      toast.success(`Selamat datang, ${data.user.name.split(" ")[0]}!`);

      if (data.user.role === "ORGANIZER") {
        navigate("/dashboard");
      } else {
        navigate("/"); // atau halaman home/events untuk customer
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Login gagal!");
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    await loginMutation(data);
  };

  const isLoading = isPending || isGooglePending;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D0D0F" }}>
      <AuthPanel quote="Every extraordinary journey begins with a single, decisive step." />

      {/* Form side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          position: "relative",
          overflowY: "auto",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: 0,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(212,169,74,0.025)",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        {/* Mobile logo */}
        <div
          className="flex lg:hidden items-center gap-3"
          style={{ marginBottom: 32 }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(212,169,74,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#D4A94A",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              letterSpacing: "0.15em",
              color: "#F9F3E8",
            }}
          >
            EVORIA
          </span>
        </div>

        {/* Form container */}
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            position: "relative",
            zIndex: 1,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Header */}
            <div style={{ ...fadeUp(0), marginBottom: 28 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#D4A94A",
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Welcome back
              </p>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 34,
                  fontWeight: 300,
                  color: "#F9F3E8",
                  lineHeight: 1.2,
                  marginBottom: 6,
                }}
              >
                Sign in to <span className="text-shimmer">Evoria</span>
              </h1>
              <p style={{ fontSize: 12, color: "#8A8A9A", lineHeight: 1.6 }}>
                Access your exclusive experiences and curated events.
              </p>
            </div>

            {/* Fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="JohnDoe@example.com"
                error={errors.email}
                required
                autoComplete="email"
                delay={100}
                registration={register("email")}
              />
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Your Password"
                error={errors.password}
                required
                autoComplete="current-password"
                delay={200}
                registration={register("password")}
              />
            </div>

            {/* Remember me + Forgot password */}
            <div
              style={{
                ...fadeUp(300),
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => setValue("rememberMe", !rememberMe)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `1px solid ${rememberMe ? "#D4A94A" : "#26262E"}`,
                    background: rememberMe ? "rgba(212,169,74,0.2)" : "#1C1C22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5.5L4 7.5L8 3"
                        stroke="#D4A94A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 11, color: "#8A8A9A" }}>
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={{
                  fontSize: 11,
                  color: "#D4A94A",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>
            {showForgot && (
              <ForgotPasswordModal onClose={() => setShowForgot(false)} />
            )}

            {/* Submit */}
            <div style={fadeUp(400)}>
              <GoldButton
                type="submit"
                loading={isPending}
                disabled={isLoading}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  Login <ArrowRight size={14} strokeWidth={2} />
                </span>
              </GoldButton>
            </div>

            {/* Divider */}
            <div
              style={{
                ...fadeUp(500),
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "16px 0",
              }}
            >
              <div style={{ flex: 1, height: 0.5, background: "#1C1C22" }} />
              <span
                style={{
                  fontSize: 10,
                  color: "#3a3a46",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                OR
              </span>
              <div style={{ flex: 1, height: 0.5, background: "#1C1C22" }} />
            </div>

            {/* Google */}
            <div style={fadeUp(600)}>
              <GoldButton
                variant="ghost"
                type="button"
                loading={isGooglePending}
                disabled={isLoading}
                onClick={() => handleGoogleLogin()}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <FcGoogle size={16} /> Continue with Google
                </span>
              </GoldButton>
            </div>

            {/* Register link */}
            <p
              style={{
                ...fadeUp(700),
                textAlign: "center",
                fontSize: 12,
                color: "#8A8A9A",
                marginTop: 20,
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#D4A94A",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
