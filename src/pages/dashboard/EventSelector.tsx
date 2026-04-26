interface EventSelectorProps {
  events: any[];
  value: string | null;
  onChange: (id: string | null) => void;
}

export function EventSelector({ events, value, onChange }: EventSelectorProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.2)", background: "#1C1C22", color: "#F9F3E8", fontSize: 12, maxWidth: 300, width: "100%" }}
      >
        <option value="">Select event...</option>
        {events.map((e: any) => (
          <option key={e.id} value={e.id}>{e.name}</option>
        ))}
      </select>
    </div>
  );
}