import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import {
  tabTitle,
  type Tab,
  type Period,
} from "../../components/utils/DashboardUtils";
import { useOrganizerEvents } from "../../hooks/dashboard-hooks/useOrganizerEvents";
import { useStatistics } from "../../hooks/dashboard-hooks/useStatistics";
import { useEventTransactions } from "../../hooks/dashboard-hooks/useEventTransactions";
import { useAttendees } from "../../hooks/dashboard-hooks/useAttendees";
import {
  AttendeesTab,
  ChangePasswordTab,
  CreateEventTab,
  EventsTab,
  ManualPaymentsTab,
  OverviewTab,
  PlaceholderTab,
  ProfileTab,
  TransactionsTab,
} from "./Tabs";
import { useLocation, useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/dashboard/")[1] ?? "overview";
  const tab = (currentPath || "overview") as Tab;

  const [period, setPeriod] = useState<Period>("month");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: events = [] } = useOrganizerEvents();
  const { data: stats } = useStatistics(
    period,
    period !== "day" ? selectedYear : undefined,
    period === "month" ? selectedMonth : undefined,
  );
  const { data: transactions = [] } = useEventTransactions(selectedEventId);
  const { data: attendees = [] } = useAttendees(selectedEventId);

  const goTo = (t: Tab) => {
    navigate(`/dashboard/${t}`);
    setSidebarOpen(false);
  };

  const tabContent: Record<Tab, React.ReactNode> = {
    overview: (
      <OverviewTab
        stats={stats}
        events={events}
        period={period}
        setPeriod={setPeriod}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    ),
    events: (
      <EventsTab
        events={events}
        onGoTo={goTo}
        setSelectedEventId={setSelectedEventId}
      />
    ),
    "create-event": <CreateEventTab />,
    transactions: (
      <TransactionsTab
        events={events}
        transactions={transactions}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
    ),
    "manual-payments": (
      <ManualPaymentsTab
        events={events}
        transactions={transactions}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
    ),
    tickets: <PlaceholderTab title="Tickets" />,
    "create-ticket": <PlaceholderTab title="Create Ticket" />,
    vouchers: <PlaceholderTab title="Vouchers" />,
    "create-voucher": <PlaceholderTab title="Create Voucher" />,
    attendees: (
      <AttendeesTab
        events={events}
        attendees={attendees}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
    ),
    profile: <ProfileTab />,
    "change-password": <ChangePasswordTab />,
  };

  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .ev-sidebar { left: 0 !important; }
          .ev-main { margin-left: 240px !important; }
          .ev-mob-btn { display: none !important; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#0D0D0F",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Sidebar */}
        <aside
          className="ev-sidebar"
          style={{
            width: 240,
            minHeight: "100vh",
            background: "#0A0A0D",
            borderRight: "1px solid rgba(212,169,74,0.09)",
            position: "fixed",
            top: 0,
            left: sidebarOpen ? 0 : -240,
            zIndex: 100,
            transition: "left 0.25s ease",
          }}
        >
          <Sidebar onNavigate={goTo} />
        </aside>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              zIndex: 99,
            }}
          />
        )}

        {/* Main */}
        <main
          className="ev-main"
          style={{
            flex: 1,
            marginLeft: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Topbar */}
          <div
            style={{
              height: 52,
              borderBottom: "1px solid rgba(212,169,74,0.08)",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#0A0A0D",
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
          >
            <button
              className="ev-mob-btn"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "#8A8A9A",
                cursor: "pointer",
              }}
            >
              <Menu size={18} />
            </button>
            <span style={{ fontSize: 11, color: "#5A5A6A" }}>Dashboard</span>
            <span style={{ fontSize: 11, color: "#3A3A46" }}>›</span>
            <span style={{ fontSize: 11, color: "#F9F3E8" }}>
              {tabTitle[tab]}
            </span>
          </div>

          {/* Content */}
          <div style={{ padding: "28px 24px", flex: 1 }}>
            <div style={{ marginBottom: 22 }}>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "#F9F3E8",
                  marginBottom: 2,
                }}
              >
                {tabTitle[tab]}
              </h1>
              <p style={{ fontSize: 11, color: "#5A5A6A" }}>
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {tabContent[tab]}
          </div>
        </main>
      </div>
    </>
  );
}
