interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div style={{ background: "#12121A", border: "1px solid rgba(212,169,74,0.12)", borderRadius: 8, padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontSize: 9, color: "#8A8A9A", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</p>
        {icon}
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F9F3E8", fontWeight: 300 }}>{value}</p>
    </div>
  );
}