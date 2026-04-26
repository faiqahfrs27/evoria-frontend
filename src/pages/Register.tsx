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
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { fadeUp } from "../lib/animationStyle";
import { axiosInstance } from "../lib/axios";
import type { RegisterSchema } from "../schemas/registerSchema";
import { registerSchema } from "../schemas/registerSchema";
import { useAuth } from "../stores/useAuth";

const getStrength = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};

const strengthColors = ["", "#EF4444", "#F59E0B", "#EAB308", "#22C55E"];
const strengthLabels = ["", "Weak", "Fine", "Good", "Strong"];

function Register({ role = "USER" }: { role?: "USER" | "ORGANIZER" }) {
  const setAuth = useAuth((s) => s.login);
  const navigate = useNavigate();
  const { handleGoogleLogin, isPending: isGooglePending } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const password = watch("password") ?? "";
  const agreeToTerms = watch("agreeToTerms");
  const strength = getStrength(password);

  const { mutateAsync: registerMutation, isPending } = useMutation({
    mutationFn: async (payload: RegisterSchema) => {
      const res = await axiosInstance.post("/auth/register", {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: role,
        referralCode: payload.referralCode || undefined,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Akun berhasil dibuat. Selamat datang!");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("Error response:", error.response);
      toast.error(error.response?.data.message || "Registrasi gagal!");
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    await registerMutation(data);
  };

  const isLoading = isPending || isGooglePending;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0D0D0F",
      }}
    >
      <AuthPanel quote="Dibuat untuk mereka yang mencari keindahan dalam hal yang luar biasa." />

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
            bottom: "20%",
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
                Create Account
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
                {role === "ORGANIZER" ? (
                  <>
                    Join as <span className="text-shimmer">Organizer</span>
                  </>
                ) : (
                  <>
                    Join the world of{" "}
                    <span className="text-shimmer">exclusive experiences</span>
                  </>
                )}
              </h1>
              <p style={{ fontSize: 12, color: "#8A8A9A", lineHeight: 1.6 }}>
                {role === "ORGANIZER" // ✅
                  ? "Create and manage your exclusive events on Evoria."
                  : "Get exclusive access to events and private experiences."}
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
                id="name"
                label="Full Name"
                placeholder="John Doe"
                error={errors.name}
                required
                autoComplete="name"
                delay={100}
                registration={register("name")}
              />
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="JohnDoe@example.com"
                error={errors.email}
                required
                autoComplete="email"
                delay={200}
                registration={register("email")}
              />

              <div>
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Min. 8 character"
                  error={errors.password}
                  required
                  autoComplete="new-password"
                  delay={300}
                  registration={register("password")}
                />
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            height: 2,
                            flex: 1,
                            borderRadius: 2,
                            background:
                              i <= strength
                                ? strengthColors[strength]
                                : "#26262E",
                            transition: "background 0.4s",
                          }}
                        />
                      ))}
                    </div>
                    {strength > 0 && (
                      <p
                        style={{ fontSize: 11, color: "#8A8A9A", marginTop: 4 }}
                      >
                        Strength:{" "}
                        <span style={{ color: "#F9F3E8" }}>
                          {strengthLabels[strength]}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <FormField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                delay={400}
                registration={register("confirmPassword")}
              />

              <FormField
                id="referralCode"
                label="Referral Code"
                placeholder="Enter referral code (optional)"
                error={errors.referralCode}
                autoComplete="off"
                delay={450}
                registration={register("referralCode")}
              />
            </div>

            {/* Terms */}
            <div style={{ ...fadeUp(500), marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() =>
                    setValue("agreeToTerms", !agreeToTerms, {
                      shouldValidate: true,
                    })
                  }
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    flexShrink: 0,
                    marginTop: 2,
                    border: `1px solid ${agreeToTerms ? "#D4A94A" : "#26262E"}`,
                    background: agreeToTerms
                      ? "rgba(212,169,74,0.2)"
                      : "#1C1C22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {agreeToTerms && (
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
                <span
                  style={{ fontSize: 11, color: "#8A8A9A", lineHeight: 1.6 }}
                >
                  I agree to Evoria's{" "}
                  <Link
                    to="/terms"
                    style={{ color: "#D4A94A", textDecoration: "none" }}
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    style={{ color: "#D4A94A", textDecoration: "none" }}
                  >
                    Privacy Policy
                  </Link>{" "}
                </span>
              </label>
              {errors.agreeToTerms && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#f87171",
                    marginTop: 4,
                    marginLeft: 26,
                  }}
                >
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div style={fadeUp(600)}>
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
                  Register <ArrowRight size={14} strokeWidth={2} />
                </span>
              </GoldButton>
            </div>

            {/* Divider */}
            <div
              style={{
                ...fadeUp(700),
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
            <div style={fadeUp(750)}>
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
                  <FcGoogle size={16} /> Continue With Google
                </span>
              </GoldButton>
            </div>

            {/* Login link */}
            <p
              style={{
                ...fadeUp(800),
                textAlign: "center",
                fontSize: 12,
                color: "#8A8A9A",
                marginTop: 20,
              }}
            >
              Already have an Account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#D4A94A",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Login
              </Link>
            </p>
            {role === "USER" ? (
              <p
                style={{
                  ...fadeUp(850),
                  textAlign: "center",
                  fontSize: 12,
                  color: "#8A8A9A",
                  marginTop: 8,
                }}
              >
                Hosting an events?{" "}
                <Link
                  to="/register/organizer"
                  style={{
                    color: "#D4A94A",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Join as Organizer
                </Link>
              </p>
            ) : (
              <p
                style={{
                  ...fadeUp(850),
                  textAlign: "center",
                  fontSize: 12,
                  color: "#8A8A9A",
                  marginTop: 8,
                }}
              >
                Join as a attendee?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#D4A94A",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Click here
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
