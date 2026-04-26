import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { cardStyle, inputStyle, labelStyle, goldBtn, ghostBtn } from "../../components/utils/DashboardUtils";

interface EditEventModalProps {
  event: any;
  onClose: () => void;
}

export function EditEventModal({ event, onClose }: EditEventModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: event.name ?? "",
    description: event.description ?? "",
    category: event.category ?? "MUSIC",
    location: event.location ?? "",
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    isFree: event.isFree ? "true" : "false",
    price: event.price?.toString() ?? "",
    totalSeats: event.totalSeats?.toString() ?? "",
    availableSeats: event.availableSeats?.toString() ?? "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (form.name !== event.name) fd.append("name", form.name);
      if (form.description !== event.description) fd.append("description", form.description);
      if (form.category !== event.category) fd.append("category", form.category);
      if (form.location !== event.location) fd.append("location", form.location);
      fd.append("startDate", new Date(form.startDate).toISOString());
      fd.append("endDate", new Date(form.endDate).toISOString());
      fd.append("isFree", form.isFree);
      fd.append("price", form.isFree === "true" ? "0" : form.price);
      fd.append("totalSeats", form.totalSeats);
      fd.append("availableSeats", form.availableSeats);
      if (thumbnail) fd.append("thumbnail", thumbnail);
      return axiosInstance.patch(`/events/${event.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Event updated");
      qc.invalidateQueries({ queryKey: ["dashboard", "events"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to update event"),
  });

  const updateForm = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ ...cardStyle, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", position: "relative" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F9F3E8" }}>Edit Event</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A9A", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div><label style={labelStyle}>Event Name</label><input value={form.name} onChange={(e) => updateForm("name", e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} /></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} style={inputStyle}>
                <option value="MUSIC">Music</option>
                <option value="SPORTS">Sports</option>
                <option value="FOOD">Food</option>
                <option value="ART">Art</option>
                <option value="EDUCATION">Education</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div><label style={labelStyle}>Location</label><input value={form.location} onChange={(e) => updateForm("location", e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Start Date</label><input type="datetime-local" value={form.startDate} onChange={(e) => updateForm("startDate", e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>End Date</label><input type="datetime-local" value={form.endDate} onChange={(e) => updateForm("endDate", e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Event Type</label>
              <select value={form.isFree} onChange={(e) => updateForm("isFree", e.target.value)} style={inputStyle}>
                <option value="false">Paid Event</option>
                <option value="true">Free Event</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input type="number" min="0" value={form.price} onChange={(e) => updateForm("price", e.target.value)} disabled={form.isFree === "true"} style={{ ...inputStyle, opacity: form.isFree === "true" ? 0.5 : 1 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Total Seats</label><input type="number" min="1" value={form.totalSeats} onChange={(e) => updateForm("totalSeats", e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Available Seats</label><input type="number" min="1" value={form.availableSeats} onChange={(e) => updateForm("availableSeats", e.target.value)} style={inputStyle} /></div>
          </div>

          <div>
            <label style={labelStyle}>Thumbnail (optional — leave empty to keep current)</label>
            {event.imageUrl && !thumbnail && (
              <img src={event.imageUrl} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4, marginBottom: 8, display: "block" }} />
            )}
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={onClose} style={{ ...ghostBtn, padding: "10px 18px" }}>Cancel</button>
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              style={{ ...goldBtn, width: "auto", padding: "10px 22px", opacity: updateMutation.isPending ? 0.7 : 1 }}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}