"use client";

import { FormEvent, useEffect, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { AdminEvents } from "@/components/admin-events";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";
import { AdminSession, convexFunctions, EventRecord, EventRsvp, MessageType } from "@/lib/convex-functions";

type Tab = "updated" | "events" | "rsvps";
type MessageFilter = "all" | "inbox" | "ideas";
type MessageRecord = { _id: string; _creationTime: number; type: MessageType; name: string; message: string; contact?: string; read: boolean; archived: boolean };
const ADMIN_SESSION_KEY = "dhoklu-admin-session";

const ago = (time: number) => {
  const minutes = Math.max(1, Math.floor((Date.now() - time) / 60_000));
  return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`;
};

function useSafePresence(active: boolean) {
  const convex = useConvex();
  const [count, setCount] = useState<number>();
  useEffect(() => {
    if (!active || !convexFeaturesEnabled) return;
    void convex.query(convexFunctions.presenceCount, {}).then(setCount).catch(() => setCount(undefined));
  }, [active, convex]);
  return count;
}

function RsvpGroup({ eventId, title, session }: { eventId: Id<"events">; title: string; session: AdminSession }) {
  const convex = useConvex();
  const [rows, setRows] = useState<EventRsvp[]>();
  const [csv, setCsv] = useState<string>();
  const [loadFailed, setLoadFailed] = useState(false);
  const [statusFailed, setStatusFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const setStatus = useMutation(convexFunctions.setRsvpStatus);

  useEffect(() => {
    let active = true;
    setRows(undefined); setCsv(undefined); setLoadFailed(false);
    void convex.query(convexFunctions.rsvpsByEvent, { ...session, eventId }).then(nextRows => {
      if (active) setRows(nextRows);
    }).catch(() => {
      if (active) setLoadFailed(true);
    });
    void convex.query(convexFunctions.exportRsvpCsv, { ...session, eventId }).then(nextCsv => {
      if (active) setCsv(nextCsv);
    }).catch(() => { if (active) setCsv(undefined); });
    return () => { active = false; };
  }, [convex, eventId, refreshKey, session]);

  const activeRows = rows?.filter(row => row.status !== "cancelled") ?? [];
  const seats = activeRows.reduce((total, row) => total + row.seats, 0);
  const fileName = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  return <section className="border-b border-[#173f5d]/20 py-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="mono text-xs uppercase">{activeRows.length} RSVP{activeRows.length === 1 ? "" : "s"} · {seats} seat{seats === 1 ? "" : "s"} going</p><h2 className="display mt-2 text-2xl text-[#ee3729]">{title}</h2></div>
      {csv !== undefined && <a className="outline-cta text-xs no-underline" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download={`${fileName}-rsvps.csv`}>export csv</a>}
    </div>
    {statusFailed && <p role="status" className="mt-3 text-sm">That status change didn’t go through. Please try again.</p>}
    {loadFailed ? <p role="status" className="mt-4 rounded-xl border border-[#173f5d]/20 bg-white p-4 text-sm">Couldn’t load RSVPs for this event. Try refreshing the page.</p> : rows === undefined ? <p className="mt-4 mono text-xs uppercase">loading RSVPs...</p> : rows.length === 0 ? <p className="mt-4 rounded-xl border border-[#173f5d]/20 bg-white p-4 text-sm">No RSVPs for this event yet.</p> : <div className="mt-4 overflow-x-auto rounded-xl border border-[#173f5d]/20 bg-white"><table className="w-full min-w-[720px] border-collapse text-left text-sm">
      <thead className="bg-[#a9d4f4]/50"><tr>{["Name", "Reply spot", "Seats", "Note", "Status"].map(label => <th key={label} className="px-4 py-3 mono text-xs font-normal uppercase">{label}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row._id} className="border-t border-[#173f5d]/10 align-top">
        <td className="px-4 py-3 font-semibold">{row.name}</td><td className="px-4 py-3">{row.contact || "—"}</td><td className="px-4 py-3 whitespace-nowrap">{row.seats}</td><td className="max-w-xs whitespace-pre-wrap px-4 py-3">{row.note || "—"}</td><td className="px-4 py-3">
          <select aria-label={`Status for ${row.name}`} value={row.status} onChange={event => {
            setStatusFailed(false);
            void setStatus({ ...session, id: row._id, status: event.target.value as EventRsvp["status"] }).then(() => setRefreshKey(key => key + 1)).catch(() => setStatusFailed(true));
          }} className="rounded border border-[#173f5d]/40 px-3 py-2 mono text-xs uppercase">
            <option value="new">new</option><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option>
          </select>
        </td>
      </tr>)}</tbody>
    </table></div>}
  </section>;
}

function AdminRsvps({ session }: { session: AdminSession }) {
  const convex = useConvex();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    let active = true;
    void convex.query(convexFunctions.adminEvents, session).then(rows => { if (active) setEvents(rows); }).catch(() => { if (active) setLoadFailed(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [convex, session]);
  if (loading) return <p className="mt-8 mono text-xs uppercase">loading events...</p>;
  if (loadFailed) return <p role="status" className="mt-8 text-sm">Couldn’t load events for RSVPs. Please try again.</p>;
  if (events.length === 0) return <p className="mt-8 text-sm">Create an event first. RSVPs will appear here under that event.</p>;
  return <div className="mt-8">{events.map(event => <RsvpGroup key={event._id} eventId={event._id} title={event.title} session={session} />)}</div>;
}

export default function AdminPage() {
  const convex = useConvex();
  const login = useMutation(convexFunctions.adminLogin);
  const logout = useMutation(convexFunctions.adminLogout);
  const markRead = useMutation(convexFunctions.markMessageRead);
  const archive = useMutation(convexFunctions.archiveMessage);
  const remove = useMutation(convexFunctions.removeMessage);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [access, setAccess] = useState<{ allowed: boolean }>();
  const [accessError, setAccessError] = useState<"disabled" | "request-failed" | null>(null);
  const [accessRetryKey, setAccessRetryKey] = useState(0);
  const [actionFailed, setActionFailed] = useState(false);
  const [tab, setTab] = useState<Tab>("updated");
  const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
  const [messages, setMessages] = useState<MessageRecord[]>();
  const [stats, setStats] = useState<{ unread: number; messages: number; rsvps: number }>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const live = useSafePresence(Boolean(access?.allowed));
  const visibleMessages = messages?.filter(row => messageFilter === "all" || (messageFilter === "ideas" ? row.type === "idea" : row.type === "hello" || row.type === "dm"));
  const active = visibleMessages?.find(row => row._id === selected);

  useEffect(() => {
    try {
      const savedToken = window.localStorage.getItem(ADMIN_SESSION_KEY);
      if (savedToken) setSession({ token: savedToken });
    } catch { setLoginError("This browser can’t save a sign-in session. Enable site storage to stay signed in."); }
    setSessionLoaded(true);
    const syncLogout = (event: StorageEvent) => {
      if (event.key === ADMIN_SESSION_KEY && !event.newValue) { setSession(null); setAccess(undefined); }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  useEffect(() => {
    if (!session) return;
    let activeRequest = true;
    setAccess(undefined); setAccessError(null);
    if (!convexFeaturesEnabled) {
      setAccessError("disabled");
      return () => { activeRequest = false; };
    }
    void convex.query(convexFunctions.adminAccess, session).then(value => {
      if (!activeRequest) return;
      setAccess(value);
      if (!value.allowed) {
        try { window.localStorage.removeItem(ADMIN_SESSION_KEY); } catch { /* Continue to sign-in if browser storage is unavailable. */ }
        setSession(null);
        setLoginError("Your saved admin session is no longer valid. Please sign in again.");
      }
    }).catch(() => { if (activeRequest) setAccessError("request-failed"); });
    return () => { activeRequest = false; };
  }, [convex, session, accessRetryKey]);

  useEffect(() => {
    if (!session || !access?.allowed || tab !== "updated") return;
    let activeRequest = true;
    void Promise.all([
      convex.query(convexFunctions.messageList, { ...session, archived: false }),
      convex.query(convexFunctions.messageStats, session),
    ]).then(([nextMessages, nextStats]) => { if (activeRequest) { setMessages(nextMessages); setStats(nextStats); } }).catch(() => { if (activeRequest) { setMessages([]); setStats(undefined); } });
    return () => { activeRequest = false; };
  }, [access?.allowed, convex, refreshKey, session, tab]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginError("");
    if (!convexFeaturesEnabled) { setLoginError("The host desk is not connected to Convex yet."); return; }
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const token = crypto.randomUUID();
    setLoggingIn(true);
    try {
      const allowed = await login({ username, password, token });
      if (!allowed) { setLoginError("That username or password didn’t match."); return; }
      window.localStorage.setItem(ADMIN_SESSION_KEY, token);
      setSession({ token }); setAccess(undefined);
    } catch {
      setLoginError("Couldn’t reach the host desk. Check your connection and try again.");
    } finally { setLoggingIn(false); }
  }

  async function signOut() {
    const token = session?.token;
    try { window.localStorage.removeItem(ADMIN_SESSION_KEY); } catch { /* Best-effort storage cleanup. */ }
    setSession(null); setAccess(undefined); setAccessError(null); setLoginError(""); setMessages(undefined); setStats(undefined);
    if (token) void logout({ token }).catch(() => { /* The browser is signed out even if Convex cannot revoke this token now. */ });
  }

  if (!sessionLoaded) return <main className="grid min-h-screen place-items-center bg-[#f9f7ed] mono text-xs uppercase text-[#173f5d]">checking the host desk...</main>;
  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f3c5ce] p-5">
    <form onSubmit={submitLogin} className="w-full max-w-md border-2 border-[#ee3729] bg-[#f9f7ed] p-8 shadow-[9px_10px_0_#ee3729]">
      <a href="/" className="mono text-xs text-[#ee3729]">← back to dhoklu</a><h1 className="display mt-8 text-5xl text-[#ee3729]">HOST DESK.</h1><p className="mt-4 text-[#173f5d]">A small, private corner for Janhvi.</p>
      <label className="section-eyebrow mt-7 block" htmlFor="username">username</label><input id="username" name="username" required autoComplete="username" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none" />
      <label className="section-eyebrow mt-4 block" htmlFor="password">password</label><input id="password" name="password" required type="password" autoComplete="current-password" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none" />
      {loginError && <p role="alert" className="mt-4 text-sm">{loginError}</p>}
      <button disabled={loggingIn} className="pill mt-7 text-xs disabled:opacity-50" type="submit">{loggingIn ? "opening desk..." : "enter desk"}</button>
    </form>
  </main>;

  if (accessError) return <main className="grid min-h-screen place-items-center bg-[#f3c5ce] p-5"><div className="max-w-md border-2 border-[#173f5d] bg-[#f9f7ed] p-8 text-center">
    <h1 className="display text-4xl text-[#ee3729]">DESK TAKING A NAP.</h1>
    <p className="mt-4 text-sm">{accessError === "disabled" ? "The host desk is disabled. Configure NEXT_PUBLIC_CONVEX_URL and make sure NEXT_PUBLIC_CONVEX_FEATURES is not set to false." : "The host desk could not reach Convex. Your saved login is still here; try again when the connection is back."}</p>
    {accessError === "request-failed" && <button type="button" onClick={() => setAccessRetryKey(key => key + 1)} className="mono mt-5 inline-block text-xs text-[#173f5d] underline">try again</button>}
    <button type="button" onClick={() => void signOut()} className="mono mt-5 block w-full text-xs text-[#173f5d] underline">sign out</button><a className="mono mt-5 inline-block text-xs text-[#173f5d]" href="/">← back to dhoklu</a>
  </div></main>;

  if (access === undefined) return <main className="grid min-h-screen place-items-center bg-[#f9f7ed] mono text-xs uppercase text-[#173f5d]">opening the desk...</main>;
  if (!access.allowed) return null;

  const tabs: Array<[Tab, string]> = [["updated", "Updated"], ["events", "Events"], ["rsvps", "RSVPs"]];
  const filters: Array<[MessageFilter, string]> = [["all", "All updates"], ["inbox", "Inbox + DMs"], ["ideas", "Ideas"]];
  const handleAction = (action: Promise<unknown>) => { setActionFailed(false); void action.then(() => setRefreshKey(key => key + 1)).catch(() => setActionFailed(true)); };

  return <main className="min-h-screen bg-[#f9f7ed] p-5 text-[#173f5d] md:p-8">
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[190px_minmax(0,1fr)]">
      <aside className="md:border-r md:border-[#173f5d]/25 md:pr-6">
        <a href="/" className="display text-3xl text-[#ee3729] no-underline">dhoklu</a><p className="mono mt-2 text-xs uppercase">host desk</p>
        <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible" aria-label="Host desk">
          {tabs.map(([key, label]) => <button key={key} onClick={() => { setTab(key); setSelected(null); }} className={`shrink-0 rounded-full px-4 py-3 text-left mono text-xs uppercase ${tab === key ? "bg-[#173f5d] text-white" : "border border-[#173f5d]/30"}`}>
            {label}{key === "updated" && stats?.unread ? <span className="ml-2 rounded-full bg-[#ee3729] px-1.5 text-white">{stats.unread}</span> : null}
          </button>)}
        </nav>
        <button type="button" onClick={() => void signOut()} className="mono mt-6 text-xs uppercase underline">sign out</button>
      </aside>

      <section>
        <div className="grid gap-3 sm:grid-cols-4">{[["unread", stats?.unread], ["messages", stats?.messages], ["rsvps", stats?.rsvps], ["here now", live]].map(([label, value]) => <div key={String(label)} title={label === "here now" ? "Visitors active on the site in the last 45 seconds." : undefined} className="rounded-xl border border-[#173f5d]/20 bg-white p-4"><p className="mono text-xs uppercase">{label}{label === "here now" && <span aria-hidden="true" className="ml-1 normal-case">ⓘ</span>}</p><strong className="display mt-2 block text-3xl text-[#ee3729]">{value ?? "—"}</strong></div>)}</div>
        {tab === "events" ? <AdminEvents credentials={session} /> : tab === "rsvps" ? <AdminRsvps session={session} /> : <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.7fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter updates">{filters.map(([key, label]) => <button key={key} type="button" aria-pressed={messageFilter === key} onClick={() => { setMessageFilter(key); setSelected(null); }} className={`rounded-full px-4 py-2 mono text-xs uppercase ${messageFilter === key ? "bg-[#173f5d] text-white" : "border border-[#173f5d]/30"}`}>{label}</button>)}</div>
            <div className="mt-4 grid gap-3">{visibleMessages?.map(row => <button key={row._id} onClick={() => { setSelected(row._id); if (!row.read) handleAction(markRead({ ...session, id: row._id, read: true })); }} className="rounded-xl border border-[#173f5d]/20 bg-white p-4 text-left">
              <div className="flex justify-between gap-3"><span><strong>{row.name}</strong><span className="ml-2 rounded-full bg-[#f3c5ce] px-2 py-1 mono text-[10px] uppercase">{row.type}</span>{!row.read && <i className="ml-2 inline-block h-2 w-2 rounded-full bg-[#ee3729]" />}</span><span className="mono text-xs">{ago(row._creationTime)}</span></div>
              <p className="mt-2 line-clamp-2 text-sm">{row.message}</p>
            </button>)}
              {messages && visibleMessages?.length === 0 && <p className="rounded-xl border border-[#173f5d]/20 bg-white p-5 text-sm">No updates in this filter yet.</p>}
              {!messages && <p className="rounded-xl border border-[#173f5d]/20 bg-white p-5 mono text-xs uppercase">loading updates...</p>}
            </div>
          </div>
          <aside className="rounded-xl border border-[#173f5d]/25 bg-[#a9d4f4] p-5">
            {actionFailed && <p role="status" className="mb-4 text-sm">That action didn’t go through. Please try again.</p>}
            {active ? <><p className="mono text-xs uppercase">{active.name} · {ago(active._creationTime)}</p><p className="mt-5 whitespace-pre-wrap">{active.message}</p>
              {active.contact && <button onClick={() => handleAction(navigator.clipboard.writeText(active.contact ?? ""))} className="outline-cta mt-5 text-xs">copy contact</button>}
              <div className="mt-5 flex gap-3"><button onClick={() => handleAction(archive({ ...session, id: active._id, archived: true }))} className="mono text-xs uppercase underline">archive</button><button onClick={() => { if (window.confirm("Delete this message?")) handleAction(remove({ ...session, id: active._id })); }} className="mono text-xs uppercase underline">delete</button></div>
            </> : <p className="mono text-xs uppercase">Pick an update to read it.</p>}
          </aside>
        </div>}
      </section>
    </div>
  </main>;
}
