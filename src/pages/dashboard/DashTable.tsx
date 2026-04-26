import { cardStyle } from "../../components/utils/DashboardUtils";

interface DashTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  emptyMessage?: string;
  minWidth?: number;
}

export function DashTable({
  headers,
  rows,
  emptyMessage = "No results.",
  minWidth = 600,
}: DashTableProps) {
  return (
    <div style={{ ...cardStyle, padding: 0, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(212,169,74,0.1)" }}>
            {headers.map((h) => (
              <th
                key={h}
                style={{ padding: "12px 16px", fontSize: 9, color: "#5A5A6A", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "left", fontWeight: 500, whiteSpace: "nowrap" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: "48px", textAlign: "center", color: "#5A5A6A", fontSize: 13 }}>
                {emptyMessage}
              </td>
            </tr>
          ) : rows.map((cells, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              {cells.map((cell, j) => (
                <td key={j} style={{ padding: "12px 16px", fontSize: 12, color: "#F9F3E8" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}