"use client";

import { FormEvent, useEffect, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { convexFunctions, AdminEventRecord, EventFields } from "@/lib/convex-functions";

type Credentials = { username: string; password: string };
type AdminEvent = AdminEventRecord;
type EventForm = { title: string; startsAt: string; kind: string; place: string; description: string; color: string; published: boolean; capacity: string };

const nextWeek = () => Date.now() + 7 * 24 * 60 * 60 * 1000;
const toLocalDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
const emptyForm = (): EventForm => ({ title: "", startsAt: toLocalDateTime(nextWeek()), kind: "workshop", place: "Pune", description: "", color: "#f7e914", published: false, capacity: "" });
const dateLabel = (timestamp: number) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }).format(timestamp);

export function AdminEvents({ credentials }: { credentials: Credentials }) {
  const convex = useConvex();
  const createEvent = useMutation(convexFunctions.createEvent);
  const updateEvent = useMutation(convexFunctions.updateEvent);
  const removeEvent = useMutation(convexFunctions.removeEvent);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<Id<"events"> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void convex.query(convexFunctions.adminEvents, credentials).then(rows => {
      if (active) { setEvents(rows); setLoadFailed(false); }
    }).catch(() => {
      if (active) { setLoadFailed(true); setEvents([]); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [convex, credentials, refreshKey]);

  const resetForm = () => { setEditingId(null); setForm(emptyForm()); setMessage(""); setError(""); };
  const beginEdit = (event: AdminEvent) => {
    setEditingId(event._id);
    setForm({ title: event.title, startsAt: toLocalDateTime(event.startsAt), kind: event.kind, place: event.place, description: event.description, color: event.color, published: event.published, capacity: event.capacity === undefined ? "" : String(event.capacity) });
    setMessage(""); setError("");
    document.getElementById("event-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const formData = (): EventFields | null => {
    const startsAt = new Date(form.startsAt).getTime();
    const capacity = form.capacity.trim() ? Number(form.capacity) : undefined;
    if (!Number.isFinite(startsAt)) { setError("Choose a valid date and time."); return null; }
    if (capacity !== undefined && (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000)) { setError("Capacity must be from 1 to 10000, or leave it blank."); return null; }
    const values: EventFields = { title: form.title.trim(), startsAt, kind: form.kind.trim(), place: form.place.trim(), description: form.description.trim(), color: form.color, published: form.published };
    if (capacity !== undefined) values.capacity = capacity;
    return values;
  };

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    const values = formData();
    if (!values) return;
    setSaving(true);
    try {
      if (editingId) await updateEvent({ ...credentials, ...values, id: editingId });
      else await createEvent({ ...credentials, ...values });
      setRefreshKey(key => key + 1);
      setMessage(editingId ? "Event updated." : "Event created.");
      setEditingId(null); setForm(emptyForm());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the event. Please try again.");
    } finally { setSaving(false); }
  }

  async function togglePublished(event: AdminEvent) {
    const { rsvpCount: _rsvpCount, _id, _creationTime, ...values } = event;
    setError(""); setMessage("");
    try {
      await updateEvent({ ...credentials, ...values, id: _id, published: !event.published });
      setRefreshKey(key => key + 1);
      setMessage(event.published ? "Event unpublished." : "Event published.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not change the event status.");
    }
  }

  async function deleteEvent(event: AdminEvent) {
    const registrations = event.rsvpCount ? ` This will also permanently delete ${event.rsvpCount} RSVP${event.rsvpCount === 1 ? "" : "s"}.` : "";
    if (!window.confirm(`Delete “${event.title}”?${registrations}`)) return;
    setError(""); setMessage("");
    try {
      await removeEvent({ ...credentials, id: event._id });
      if (editingId === event._id) resetForm();
      setRefreshKey(key => key + 1);
      setMessage("Event deleted.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete the event.");
    }
  }

  const inputClass = "contact-input mt-2 w-full rounded-lg border border-[#173f5d]/40 bg-white px-3 py-2 outline-none focus:border-[#ee3729]";
  return <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.85fr)]">
    <section aria-labelledby="events-admin-title">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="mono text-xs uppercase">public event listings</p><h2 id="events-admin-title" className="display mt-2 text-3xl text-[#ee3729]">EVENTS.</h2></div><p className="mono text-xs">{events.length} total</p></div>
      {loading ? <p className="mt-6 mono text-xs uppercase">loading events...</p> : loadFailed ? <p role="status" className="mt-6 text-sm">Couldn’t load events. Check the Convex deployment and try again.</p> : events.length === 0 ? <p className="mt-6 rounded-xl border border-[#173f5d]/20 bg-white p-5 text-sm">No events yet. Create one and publish it when it’s ready.</p> : <div className="mt-5 grid gap-3">{events.map(event => <article key={event._id} className="rounded-xl border border-[#173f5d]/20 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-1 mono text-[10px] uppercase ${event.published ? "bg-[#d9f3d1]" : "bg-[#eee]"}`}>{event.published ? "published" : "draft"}</span><span className="mono text-xs uppercase">{event.kind}</span></div><h3 className="display mt-3 break-words text-xl text-[#ee3729]">{event.title}</h3><p className="mt-2 text-sm">{dateLabel(event.startsAt)} · {event.place}</p>{event.description && <p className="mt-2 line-clamp-2 text-sm text-[#173f5d]/80">{event.description}</p>}<p className="mt-2 mono text-xs uppercase">{event.rsvpCount} RSVP{event.rsvpCount === 1 ? "" : "s"}{event.capacity ? ` · ${event.capacity} seats` : " · no capacity limit"}</p></div><span className="h-8 w-8 shrink-0 rounded-full border border-[#173f5d]/20" style={{ backgroundColor: event.color }} aria-label={`Card color ${event.color}`} /></div>
        <div className="mt-4 flex flex-wrap gap-4"><button type="button" onClick={() => beginEdit(event)} className="mono text-xs uppercase underline">edit</button><button type="button" onClick={() => void togglePublished(event)} className="mono text-xs uppercase underline">{event.published ? "unpublish" : "publish"}</button><button type="button" onClick={() => void deleteEvent(event)} className="mono text-xs uppercase text-[#ee3729] underline">delete</button></div>
      </article>)}</div>}
    </section>

    <section id="event-editor" className="h-fit rounded-xl border border-[#173f5d]/25 bg-[#a9d4f4] p-5 md:p-6" aria-labelledby="event-editor-title">
      <p className="mono text-xs uppercase">{editingId ? "edit this gathering" : "add a gathering"}</p><h2 id="event-editor-title" className="display mt-2 text-3xl text-[#ee3729]">{editingId ? "EDIT EVENT." : "NEW EVENT."}</h2>
      <form onSubmit={save} className="mt-5 grid gap-4">
        <label className="section-eyebrow">title<input required maxLength={100} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className={inputClass} placeholder="A Pune making table" /></label>
        <label className="section-eyebrow">date and time<input required type="datetime-local" value={form.startsAt} onChange={event => setForm({ ...form, startsAt: event.target.value })} className={inputClass} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="section-eyebrow">type<input required maxLength={60} value={form.kind} onChange={event => setForm({ ...form, kind: event.target.value })} className={inputClass} placeholder="workshop" /></label><label className="section-eyebrow">location<input required maxLength={120} value={form.place} onChange={event => setForm({ ...form, place: event.target.value })} className={inputClass} placeholder="Pune" /></label></div>
        <label className="section-eyebrow">description<textarea maxLength={1000} rows={4} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} className={inputClass} placeholder="What will people make or do?" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="section-eyebrow">seat capacity<input type="number" min={1} max={10000} value={form.capacity} onChange={event => setForm({ ...form, capacity: event.target.value })} className={inputClass} placeholder="No limit" /></label><label className="section-eyebrow">card color<input type="color" value={form.color} onChange={event => setForm({ ...form, color: event.target.value })} className={`${inputClass} h-11 p-1`} /></label></div>
        <label className="flex items-center gap-3 mono text-xs uppercase"><input type="checkbox" checked={form.published} onChange={event => setForm({ ...form, published: event.target.checked })} className="h-4 w-4 accent-[#ee3729]" />show this event publicly</label>
        {error && <p role="alert" className="text-sm text-[#9f1c16]">{error}</p>}{message && <p role="status" className="text-sm">{message}</p>}
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className="rounded-full bg-[#173f5d] px-5 py-3 mono text-xs uppercase text-white disabled:opacity-50">{saving ? "saving..." : editingId ? "save changes" : "create event"}</button>{editingId && <button type="button" onClick={resetForm} className="rounded-full border border-[#173f5d]/50 px-5 py-3 mono text-xs uppercase">cancel edit</button>}</div>
      </form>
    </section>
  </div>;
}
