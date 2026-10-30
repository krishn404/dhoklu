import { makeFunctionReference } from "convex/server";

export type MessageType = "hello" | "idea" | "dm";
type AdminCredentials = { username: string; password: string };
export const convexFunctions = {
  sendMessage: makeFunctionReference<"mutation", { type: MessageType; name?: string; message: string; contact?: string; website?: string; sessionId: string }, string | null>("messages:send"),
  createRsvp: makeFunctionReference<"mutation", { workshopId: string; name: string; contact?: string; seats: number; note?: string; sessionId: string }, string>("rsvps:create"),
  going: makeFunctionReference<"query", { workshopId: string }, number>("rsvps:going"),
  heartbeat: makeFunctionReference<"mutation", { sessionId: string }, null>("presence:heartbeat"),
  leave: makeFunctionReference<"mutation", { sessionId: string }, null>("presence:leave"),
  presenceCount: makeFunctionReference<"query", Record<string, never>, number>("presence:count"),
  messageList: makeFunctionReference<"query", AdminCredentials & { type?: MessageType; unreadOnly?: boolean; archived?: boolean }, Array<{ _id: string; _creationTime: number; type: MessageType; name: string; message: string; contact?: string; read: boolean; archived: boolean }>>("messages:list"),
  messageStats: makeFunctionReference<"query", AdminCredentials, { unread: number; messages: number; rsvps: number }>("messages:stats"),
  markMessageRead: makeFunctionReference<"mutation", AdminCredentials & { id: string; read: boolean }, null>("messages:markRead"),
  archiveMessage: makeFunctionReference<"mutation", AdminCredentials & { id: string; archived: boolean }, null>("messages:archive"),
  removeMessage: makeFunctionReference<"mutation", AdminCredentials & { id: string }, null>("messages:remove"),
  rsvpsByWorkshop: makeFunctionReference<"query", AdminCredentials & { workshopId: string }, Array<{ _id: string; _creationTime: number; name: string; contact?: string; seats: number; note?: string; status: "new" | "confirmed" | "cancelled" }>>("rsvps:listByWorkshop"),
  setRsvpStatus: makeFunctionReference<"mutation", AdminCredentials & { id: string; status: "new" | "confirmed" | "cancelled" }, null>("rsvps:setStatus"),
  exportRsvpCsv: makeFunctionReference<"query", AdminCredentials & { workshopId: string }, string>("rsvps:exportCsv"),
  adminAccess: makeFunctionReference<"query", AdminCredentials, { allowed: boolean }>("dashboard:access"),
};
