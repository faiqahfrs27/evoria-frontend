import {
  CalendarDays,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  ReceiptText,
  Settings,
  Tag,
  User,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import type { Tab } from "../../components/utils/DashboardUtils";
import { useAuth } from "../../stores/useAuth";
import { LogoutModal } from "../../components/LogoutModal";

const navGroups = [
  {
    label: "Platform",
    items: [
      {
        id: "overview" as Tab,
        label: "Dashboard",
        icon: <LayoutDashboard size={14} />,
      },
    ],
  },
  {
    label: "Orders",
    items: [
      {
        id: "transactions" as Tab,
        label: "Order History",
        icon: <ReceiptText size={14} />,
      },
      {
        id: "manual-payments" as Tab,
        label: "Manual Payments",
        icon: <CreditCard size={14} />,
      },
    ],
  },
  {
    label: "All Events",
    items: [
      {
        id: "events" as Tab,
        label: "All Events",
        icon: <CalendarDays size={14} />,
      },
      {
        id: "create-event" as Tab,
        label: "Create Event",
        icon: <Plus size={14} />,
      },
    ],
  },
  {
    label: "Tickets",
    items: [
      {
        id: "attendees" as Tab,
        label: "Attendees",
        icon: <UserCheck size={14} />,
      },
    ],
  },
  {
    label: "Vouchers",
    items: [
      { id: "vouchers" as Tab, label: "All Vouchers", icon: <Tag size={14} /> },
      {
        id: "create-voucher" as Tab,
        label: "Create Voucher",
        icon: <Plus size={14} />,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "profile" as Tab, label: "Profile", icon: <Settings size={14} /> },
      {
        id: "change-password" as Tab,
        label: "Change Password",
        icon: <Lock size={14} />,
      },
    ],
  },
];


export function Sidebar({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const location = useLocation();
  const currentPath = location.pathname.split("/dashboard/")[1] ?? "overview";
  const activeTab = (currentPath || "overview") as Tab;
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(navGroups.map((g) => [g.label, true])),
  );
  const [showLogout, setShowLogout] = useState(false);
  
  const toggle = (label: string) =>
    setExpanded((p) => ({ ...p, [label]: !p[label] }));


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(212,169,74,0.08)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1px solid rgba(212,169,74,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#D4A94A",
              }}
            />
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15,
                letterSpacing: "0.18em",
                color: "#F9F3E8",
              }}
            >
              EVORIA
            </span>
            <p
              style={{
                fontSize: 9,
                color: "#5A5A6A",
                letterSpacing: "0.1em",
                marginTop: 1,
              }}
            >
              ORGANIZER
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 2 }}>
            <button
              onClick={() => toggle(group.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#5A5A6A",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {group.label}
              <ChevronRight
                size={10}
                style={{
                  transform: expanded[group.label] ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {expanded[group.label] &&
              group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 4,
                    border: "none",
                    background:
                      activeTab === item.id
                        ? "rgba(212,169,74,0.08)"
                        : "transparent",
                    color: activeTab === item.id ? "#D4A94A" : "#8A8A9A",
                    fontSize: 12,
                    cursor: "pointer",
                    marginBottom: 1,
                    transition: "all 0.15s",
                    textAlign: "left",
                    borderLeft:
                      activeTab === item.id
                        ? "2px solid #D4A94A"
                        : "2px solid transparent",
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div
        style={{
          padding: "14px 18px",
          borderTop: "1px solid rgba(212,169,74,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(212,169,74,0.1)",
              border: "1px solid rgba(212,169,74,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={13} color="#D4A94A" />
            )}
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#F9F3E8", fontWeight: 500 }}>
              {user?.name}
            </p>
            <p
              style={{ fontSize: 9, color: "#5A5A6A", letterSpacing: "0.06em" }}
            >
              ORGANIZER
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowLogout(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "#5A5A6A",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LogOut size={12} /> Sign out
        </button>
        <LogoutModal
          isOpen={showLogout}
          onClose={() => setShowLogout(false)}
          onConfirm={() => {
            logout();
            setShowLogout(false);
          }}
        />
      </div>
    </div>
  );
}
