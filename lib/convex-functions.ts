import { makeFunctionReference } from "convex/server";
import type { Id } from "@/convex/_generated/dataModel";

export type MessageType = "hello" | "idea" | "dm";
type AdminCredentials = { username: string; password: string };
export type EventFields = { title: string; startsAt: number; kind: string; place: string; description: string; color: string; published: boolean; capacity?: number };
export type EventRecord = EventFields & { _id: Id<"events">; _creationTime: number; rsvpCount?: number };
export type AdminEventRecord = EventRecord & { rsvpCount: number };
export type EventRsvp = { _id: string; _creationTime: number; name: string; contact?: string; seats: number; note?: string; status: "new" | "confirmed" | "cancelled" };
export const convexFunctions = {
  sendMessage: makeFunctionReference<"mutation", { type: MessageType; name?: string; message: string; contact?: string; website?: string; sessionId: string }, string | null>("messages:send"),
  publicEvents: makeFunctionReference<"query", Record<string, never>, EventRecord[]>("events:listPublic"),
  adminEvents: makeFunctionReference<"query", AdminCredentials, AdminEventRecord[]>("events:listAdmin"),
  createEvent: makeFunctionReference<"mutation", AdminCredentials & EventFields, Id<"events">>("events:create"),
  updateEvent: makeFunctionReference<"mutation", AdminCredentials & EventFields & { id: Id<"events"> }, null>("events:update"),
  removeEvent: makeFunctionReference<"mutation", AdminCredentials & { id: Id<"events"> }, null>("events:remove"),
  createRsvp: makeFunctionReference<"mutation", { eventId: Id<"events">; name: string; contact?: string; seats: number; note?: string; sessionId: string }, string>("rsvps:create"),
  going: makeFunctionReference<"query", { eventId: Id<"events"> }, number>("rsvps:going"),
  heartbeat: makeFunctionReference<"mutation", { sessionId: string }, null>("presence:heartbeat"),
  leave: makeFunctionReference<"mutation", { sessionId: string }, null>("presence:leave"),
  presenceCount: makeFunctionReference<"query", Record<string, never>, number>("presence:count"),
  messageList: makeFunctionReference<"query", AdminCredentials & { type?: MessageType; unreadOnly?: boolean; archived?: boolean }, Array<{ _id: string; _creationTime: number; type: MessageType; name: string; message: string; contact?: string; read: boolean; archived: boolean }>>("messages:list"),
  messageStats: makeFunctionReference<"query", AdminCredentials, { unread: number; messages: number; rsvps: number }>("messages:stats"),
  markMessageRead: makeFunctionReference<"mutation", AdminCredentials & { id: string; read: boolean }, null>("messages:markRead"),
  archiveMessage: makeFunctionReference<"mutation", AdminCredentials & { id: string; archived: boolean }, null>("messages:archive"),
  removeMessage: makeFunctionReference<"mutation", AdminCredentials & { id: string }, null>("messages:remove"),
  rsvpsByEvent: makeFunctionReference<"query", AdminCredentials & { eventId: Id<"events"> }, EventRsvp[]>("rsvps:listByEvent"),
  setRsvpStatus: makeFunctionReference<"mutation", AdminCredentials & { id: string; status: "new" | "confirmed" | "cancelled" }, null>("rsvps:setStatus"),
  exportRsvpCsv: makeFunctionReference<"query", AdminCredentials & { eventId: Id<"events"> }, string>("rsvps:exportCsv"),
  adminAccess: makeFunctionReference<"query", AdminCredentials, { allowed: boolean }>("dashboard:access"),
};
