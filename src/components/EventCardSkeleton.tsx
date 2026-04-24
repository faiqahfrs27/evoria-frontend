function EventCardSkeleton() {
  return (
    <div style={{
      borderRadius: "1rem",
      overflow: "hidden",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{
        height: "11rem",
        background: "rgba(255,255,255,0.08)",
      }} />
      <div style={{ padding: "1rem" }}>
        <div style={{ height: "1rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.08)", marginBottom: "0.75rem", width: "75%" }} />
        <div style={{ height: "0.75rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.06)", marginBottom: "1rem", width: "50%" }} />
        <div style={{ height: "1rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.08)", width: "33%" }} />
      </div>
    </div>
  );
}

export default EventCardSkeleton;