"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send, MessageCircle } from "lucide-react";
import { chatThreads, recommendedAlumni } from "@/lib/mock-data";
import type { Alumni } from "@/lib/mock-data";

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
    { id: "m3", text: "Is there still capacity for summer applications?", time: "2:37 PM", sent: true },
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

const expandVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto" as const, opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
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

export function ChatContent() {
  const [activeTab, setActiveTab] = useState<Tab>("1:1");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [composeMessage, setComposeMessage] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [localThreads, setLocalThreads] = useState<Record<string, MockMessage[]>>(mockConversation);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyEndRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => chatThreads.filter((t) => (activeTab === "Groups" ? t.isGroup : !t.isGroup)),
    [activeTab]
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

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl">Messages</h1>
          {totalUnread > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-clay-500 px-1.5 text-[10px] font-semibold text-white">
              {totalUnread}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-6 border-b border-ink-900/10">
        {(["1:1", "Groups"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedId(null);
            }}
            className={`relative pb-3 text-sm transition-colors ${
              activeTab === tab
                ? "border-b-2 border-brass-500 font-semibold text-ink-900"
                : "text-ink-900/50 hover:text-ink-900/70"
            }`}
          >
            {tab}
            <span className="ml-1.5 text-[10px] text-ink-900/40">
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-2" ref={scrollRef}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border border-dashed border-ink-900/20 bg-paper-50/60 p-8 sm:p-10">
            <MessageCircle size={22} className="text-brass-500" strokeWidth={1.6} />
            <div>
              <h3 className="font-display text-2xl">No conversations yet</h3>
              <p className="mt-2 max-w-prose text-sm leading-6 text-ink-900/60">
                Start a conversation from the Network page.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((thread, i) => {
              const messages = localThreads[thread.id] ?? [];
              const isExpanded = selectedId === thread.id;

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
                    onClick={() => setSelectedId(isExpanded ? null : thread.id)}
                    className={`flex w-full items-center gap-3 px-2 py-3 text-left transition-colors cursor-pointer border-b border-ink-900/5 ${
                      isExpanded ? "bg-paper-50" : "hover:bg-paper-50"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brass-500/15 text-brass-500 font-semibold text-sm">
                      {thread.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-sm">{thread.name}</span>
                        <span className="shrink-0 font-mono text-[10px] text-ink-900/40">
                          {thread.time}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate max-w-[200px] text-xs text-ink-900/50">
                          {thread.lastMessage}
                        </span>
                        {thread.unread > 0 && (
                          <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-clay-500 px-1 text-[9px] font-semibold text-white">
                            {thread.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        variants={expandVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="border-b border-ink-900/5 bg-paper-50/50 px-4 py-4">
                          <div className="space-y-3" ref={scrollRef}>
                            {messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${
                                  msg.sent ? "justify-end" : "justify-start"
                                }`}
                              >
                                {!msg.sent && (
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass-500/15 text-brass-500 text-[10px] font-semibold">
                                    {thread.initials}
                                  </div>
                                )}
                                <div
                                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                                    msg.sent
                                      ? "bg-brass-500/10 text-ink-900"
                                      : "bg-ink-900/5 text-ink-900"
                                  }`}
                                >
                                  <p className="text-sm">{msg.text}</p>
                                  <p className="mt-1 font-mono text-[9px] text-ink-900/40">
                                    {msg.time}
                                  </p>
                                </div>
                                {msg.sent && (
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-500 text-[10px] font-semibold text-white">
                                    You
                                  </div>
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
                              className="flex-1 rounded-full border border-ink-900/15 bg-white px-4 py-2 text-sm outline-none transition-colors placeholder:text-ink-900/35 focus:border-brass-500"
                            />
                            <button
                              onClick={() => handleSendReply(thread.id)}
                              disabled={!replyInputs[thread.id]?.trim()}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-500 text-white transition-colors hover:bg-ink-900 disabled:opacity-40 disabled:cursor-not-allowed"
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
      </div>

      <button
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brass-500 text-white shadow-lg transition-colors hover:bg-ink-900"
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
            className="fixed inset-0 z-50 bg-ink-900/50 flex items-start justify-center"
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
                className="absolute right-4 top-4 text-ink-900/40 transition-colors hover:text-ink-900"
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
                        ? "bg-brass-500/10"
                        : "hover:bg-paper-50"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-500/15 text-brass-500 text-xs font-semibold">
                      {alumni.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{alumni.name}</p>
                      <p className="truncate text-[11px] text-ink-900/50">
                        {alumni.role} at {alumni.company}
                      </p>
                    </div>
                    <div
                      className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                        selectedAlumni?.id === alumni.id
                          ? "border-brass-500 bg-brass-500"
                          : "border-ink-900/25"
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
                className="mt-4 w-full resize-none rounded-lg border border-ink-900/15 bg-white p-3 text-sm outline-none transition-colors placeholder:text-ink-900/35 focus:border-brass-500"
              />

              <button
                onClick={handleComposeSend}
                disabled={!selectedAlumni || !composeMessage.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brass-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                Send
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
