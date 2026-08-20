"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send, MessageCircle, Search, ShieldCheck, BriefcaseBusiness, GraduationCap, Clock } from "lucide-react";
import { chatThreads, recommendedAlumni } from "@/lib/mock-data";
import type { Alumni } from "@/lib/mock-data";
import { ReferralThread } from "@/components/ReferralThread";
import { Card, Badge } from "@/components/ui";

type Tab = "1:1" | "Groups";

type MockMessage = {
  id: string;
  text: string;
  time: string;
  sent: boolean;
};

const mockConversation: Record<string, MockMessage[]> = {
  "chat-1": [
    { id: "m1", text: "Hey Priya! I saw your work on the Northstar redesign. Really impressive.", time: "10:02 AM", sent: true },
    { id: "m2", text: "Thank you! It was a fun project. The team there is great.", time: "10:05 AM", sent: false },
    { id: "m3", text: "Would you be open to doing a portfolio review sometime this week?", time: "10:07 AM", sent: true },
    { id: "m4", text: "I'd love to help with your portfolio review!", time: "10:10 AM", sent: false },
  ],
  "chat-3": [
    { id: "m1", text: "Marcus, quick question about the Fieldwork fellowship.", time: "2:30 PM", sent: true },
    { id: "m2", text: "Sure, what's on your mind?", time: "2:35 PM", sent: false },
    { id: "m3", text: "Is there still capacity for summer applications?", time: "2:37 AM", sent: true },
    { id: "m4", text: "Let me know when you're free for a call", time: "2:40 PM", sent: false },
  ],
  "chat-5": [
    { id: "m1", text: "Nina, have you tried the new React compiler?", time: "9:00 AM", sent: true },
    { id: "m2", text: "Not yet at Stripe but I've been reading the docs.", time: "9:15 AM", sent: false },
    { id: "m3", text: "Check out this React pattern", time: "9:18 AM", sent: false },
  ],
  "chat-2": [
    { id: "m1", text: "When is the panel scheduled?", time: "11:00 AM", sent: true },
    { id: "m2", text: "Elena: The recording will be shared tomorrow", time: "11:30 AM", sent: false },
    { id: "m3", text: "Thanks, looking forward to it!", time: "11:32 AM", sent: true },
  ],
  "chat-4": [
    { id: "m1", text: "Jon: I've booked the venue", time: "3:00 PM", sent: false },
    { id: "m2", text: "Great! How many attendees are we expecting?", time: "3:05 PM", sent: true },
    { id: "m3", text: "Around 80 people based on current RSVPs.", time: "3:08 PM", sent: false },
  ],
};

const listItemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.15 } },
};

const roleBadges = {
  student: { label: "Student", color: "bg-sage/10 text-sage", icon: GraduationCap },
  alumni: { label: "Alumni", color: "bg-brass/10 text-brass", icon: BriefcaseBusiness },
  faculty: { label: "Faculty", color: "bg-indigo/10 text-indigo", icon: GraduationCap },
  admin: { label: "Admin", color: "bg-red/10 text-red", icon: ShieldCheck },
};

export function ChatContent() {
  const [activeTab, setActiveTab] = useState<Tab>("1:1");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [composeMessage, setComposeMessage] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [localThreads, setLocalThreads] = useState<Record<string, MockMessage[]>>(mockConversation);
  const [messageSearch, setMessageSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => {
      let result = chatThreads.filter((t) => (activeTab === "Groups" ? t.isGroup : !t.isGroup));
      if (messageSearch.trim()) {
        const q = messageSearch.toLowerCase();
        result = result.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.lastMessage.toLowerCase().includes(q) ||
            (t.role && t.role.toLowerCase().includes(q))
        );
      }
      return result;
    },
    [activeTab, messageSearch]
  );

  const totalUnread = chatThreads.reduce((sum, t) => sum + t.unread, 0);

  useEffect(() => {
    if (selectedId && replyEndRef.current) {
      replyEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedId, localThreads]);

  const handleSendReply = (threadId: string) => {
    const text = replyInputs[threadId]?.trim();
    if (!text) return;
    const newMsg: MockMessage = {
      id: `local-${Date.now()}`,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sent: true,
    };
    setLocalThreads((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), newMsg],
    }));
    setReplyInputs((prev) => ({ ...prev, [threadId]: "" }));
  };

  const handleComposeSend = () => {
    if (!selectedAlumni || !composeMessage.trim()) return;
    setComposeOpen(false);
    setSelectedAlumni(null);
    setComposeMessage("");
  };

  const tabCounts = useMemo(
    () => ({
      "1:1": chatThreads.filter((t) => !t.isGroup).length,
      Groups: chatThreads.filter((t) => t.isGroup).length,
    }),
    []
  );

  const getThreadReferralStatus = (threadId: string) => {
    const statusMap: Record<string, "pending" | "accepted" | "referred" | "hired" | "rejected" | null> = {
      "chat-1": "accepted",
      "chat-3": "pending",
      "chat-5": "referred",
      "chat-2": "hired",
      "chat-4": null,
    };
    return statusMap[threadId] || null;
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl">Messages</h1>
          {totalUnread > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-clay px-1.5 text-[10px] font-semibold text-white">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-ink/10 bg-white outline-none placeholder:text-ink/35 focus:border-brass focus:ring-1 focus:ring-brass"
            aria-label="Search conversations"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-6 lg:grid lg:grid-cols-[1.2fr_1fr]">
        <div className="flex-1 min-w-0 lg:border-r lg:border-ink/10 lg:pr-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-[calc(100vh-12rem)] overflow-y-auto"
            ref={listRef}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 border border-dashed border-ink/20 bg-paper/60 p-8 sm:p-10 h-full">
                <MessageCircle size={22} className="text-brass" strokeWidth={1.6} />
                <div className="text-center">
                  <h3 className="font-display text-2xl">No conversations yet</h3>
                  <p className="mt-2 max-w-prose text-sm leading-6 text-ink/60">
                    Start a conversation from the Network page.
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((thread, i) => {
                  const messages = localThreads[thread.id] ?? [];
                  const isExpanded = selectedId === thread.id;
                  const role = thread.role || "student";
                  const roleInfo = roleBadges[role as keyof typeof roleBadges] || roleBadges.student;
                  const referralStatus = getThreadReferralStatus(thread.id);

                  return (
                    <motion.div
                      key={thread.id}
                      custom={i}
                      variants={listItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                    >
                      <button
                        onClick={() => {
                          setSelectedId(isExpanded ? null : thread.id);
                          listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors cursor-pointer border-b border-ink/5 ${
                          isExpanded ? "bg-brass/5" : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass font-semibold text-sm">
                            {thread.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-semibold text-sm truncate">{thread.name}</span>
                              <span className="shrink-0 font-mono text-[10px] text-ink/40">{thread.time}</span>
                            </div>
                            <div className="mt-0.5 flex items-center justify-between gap-2">
                              <span className="truncate max-w-[200px] text-xs text-ink/50">{thread.lastMessage}</span>
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${roleInfo.color}`}>
                                  <roleInfo.icon size={10} className="mr-1" />
                                  {roleInfo.label}
                                </span>
                                {thread.unread > 0 && (
                                  <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-clay px-1 text-[9px] font-semibold text-white">
                                    {thread.unread}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={16} className={`text-ink/30 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-ink/5 bg-paper/30"
                          >
                            <div className="px-4 py-4 space-y-3">
                              {referralStatus && (
                                <div className="rounded-lg bg-brass/5 border border-brass/20 p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-xs uppercase tracking-wider text-brass">Referral Status</span>
                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] bg-brass/15 text-brass">
                                      {referralStatus}
                                    </span>
                                  </div>
                                  <ReferralThread status={referralStatus} />
                                </div>
                              )}
                            </div>

                            <div className="border-t border-ink/5 px-4 py-3">
                              <div className="space-y-3" ref={scrollRef}>
                                {messages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${msg.sent ? "justify-end" : "justify-start"}`}
                                  >
                                    {!msg.sent && (
                                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass text-[10px] font-semibold">
                                        {thread.initials}
                                      </div>
                                    )}
                                    <div
                                      className={`max-w-[75%] rounded-lg px-3 py-2 ${msg.sent ? "bg-brass/10 text-ink" : "bg-ink/5 text-ink"}`}
                                    >
                                      <p className="text-sm">{msg.text}</p>
                                      <p className="mt-1 font-mono text-[9px] text-ink/40">{msg.time}</p>
                                    </div>
                                    {msg.sent && (
                                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-white">You</div>
                                    )}
                                  </div>
                                ))}
                                <div ref={replyEndRef} />
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={replyInputs[thread.id] ?? ""}
                                  onChange={(e) =>
                                    setReplyInputs((prev) => ({
                                      ...prev,
                                      [thread.id]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendReply(thread.id);
                                    }
                                  }}
                                  placeholder="Type a message..."
                                  className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-brass"
                                />
                                <button
                                  onClick={() => handleSendReply(thread.id)}
                                  disabled={!replyInputs[thread.id]?.trim()}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass text-white transition-colors hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Send size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          )}
        </div>

        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:sticky lg:top-24 h-[calc(100vh-12rem)] overflow-y-auto"
            >
              <Card padding="lg" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/15 text-brass font-semibold text-sm">
                      {chatThreads.find((t) => t.id === selectedId)?.initials || "?"}
                    </div>
                    <div>
                      <p className="font-display text-xl">
                        {chatThreads.find((t) => t.id === selectedId)?.name || "Conversation"}
                      </p>
                      <p className="text-sm text-ink/50">Active now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const thread = chatThreads.find((t) => t.id === selectedId);
                      if (!thread || !thread.role) return null;
                      const info = roleBadges[thread.role as keyof typeof roleBadges] || roleBadges.student;
                      return (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${info.color}`}>
                          <info.icon size={10} className="mr-1" />
                          {info.label}
                        </span>
                      );
                    })()}
                    <button
                      onClick={() => setSelectedId(null)}
                      className="p-1 text-ink/40 hover:text-ink"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {(() => {
                  const thread = chatThreads.find((t) => t.id === selectedId);
                  if (!thread) return null;
                  const status = getThreadReferralStatus(thread.id);
                  if (!status) return null;
                  return (
                    <div className="rounded-lg bg-brass/5 border border-brass/20 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-brass">Referral Status</span>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] bg-brass/15 text-brass">
                          {status}
                        </span>
                      </div>
                      <ReferralThread status={status} />
                    </div>
                  );
                })()}

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {(localThreads[selectedId!] ?? []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.sent ? "justify-end" : "justify-start"}`}
                    >
                      {!msg.sent && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass text-[10px] font-semibold">
                          {chatThreads.find((t) => t.id === selectedId)?.initials || "?"}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 ${msg.sent ? "bg-brass/10 text-ink" : "bg-ink/5 text-ink"}`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="mt-1 font-mono text-[9px] text-ink/40">{msg.time}</p>
                      </div>
                      {msg.sent && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-white">
                          You
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={replyEndRef} />
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-ink/5 pt-4">
                  <input
                    type="text"
                    value={replyInputs[selectedId!] ?? ""}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({
                        ...prev,
                        [selectedId!]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply(selectedId!);
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-brass"
                  />
                  <button
                    onClick={() => handleSendReply(selectedId!)}
                    disabled={!replyInputs[selectedId!]?.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass text-white transition-colors hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    <button
      onClick={() => setComposeOpen(true)}
      className="fixed bottom-24 right-6 md:bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-white shadow-lg transition-colors hover:bg-ink lg:hidden"
      aria-label="New message"
    >
      <Plus size={22} />
    </button>

    <AnimatePresence>
      {composeOpen && (
        <motion.div
          variants={modalBackdrop}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 bg-ink/50 flex items-start justify-center"
          onClick={() => setComposeOpen(false)}
        >
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative mt-20 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <button
              onClick={() => setComposeOpen(false)}
              className="absolute right-4 top-4 text-ink/40 transition-colors hover:text-ink"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="font-display text-2xl">New Message</h2>

            <div className="mt-5 max-h-60 space-y-1 overflow-y-auto">
              {recommendedAlumni.map((alumni) => (
                <button
                  key={alumni.id}
                  onClick={() =>
                    setSelectedAlumni(
                      selectedAlumni?.id === alumni.id ? null : alumni
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedAlumni?.id === alumni.id
                      ? "bg-brass/10"
                      : "hover:bg-paper/50"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass text-xs font-semibold">
                    {alumni.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{alumni.name}</p>
                    <p className="truncate text-[11px] text-ink/50">
                      {alumni.role} at {alumni.company}
                    </p>
                  </div>
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                      selectedAlumni?.id === alumni.id
                        ? "border-brass bg-brass"
                        : "border-ink/25"
                    }`}
                  >
                    {selectedAlumni?.id === alumni.id && (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <textarea
              value={composeMessage}
              onChange={(e) => setComposeMessage(e.target.value)}
              placeholder="Write a message..."
              rows={3}
              className="mt-4 w-full resize-none rounded-lg border border-ink/15 bg-white p-3 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-brass"
            />

            <button
              onClick={handleComposeSend}
              disabled={!selectedAlumni || !composeMessage.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brass px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              Send
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}