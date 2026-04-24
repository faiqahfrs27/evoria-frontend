import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  required?: boolean;
  autoComplete?: string;
  delay?: number;
  registration: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  };
}

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  required,
  autoComplete,
  delay = 0,
  registration,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        animation: `fade-up 0.6s ${delay}ms ease forwards`,
        opacity: 0,
      }}
    >
      <label
        htmlFor={id}
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#8A8A9A",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#D4A94A", marginLeft: 2 }}>*</span>
        )}
      </label>

      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registration}
          style={{
            width: "100%",
            background: "#1C1C22",
            border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "#26262E"}`,
            borderRadius: 8,
            padding: isPassword ? "11px 44px 11px 16px" : "11px 16px",
            fontSize: 13,
            color: "#F9F3E8",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s, background 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "#D4A94A";
            (e.target as HTMLInputElement).style.background = "#141418";
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error
              ? "rgba(239,68,68,0.6)"
              : "#26262E";
            (e.target as HTMLInputElement).style.background = "#1C1C22";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8A8A9A",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            {showPassword ? (
              <EyeOff size={15} strokeWidth={1.5} />
            ) : (
              <Eye size={15} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p style={{ fontSize: 11, color: "#f87171", marginTop: 2 }}>
          {error.message}
        </p>
      )}
    </div>
  );
}