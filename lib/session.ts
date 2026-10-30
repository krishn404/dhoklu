"use client";
const key = "dhoklu-session-id";
export function getSessionId() { const existing = sessionStorage.getItem(key); if (existing) return existing; const next = crypto.randomUUID(); sessionStorage.setItem(key, next); return next; }
