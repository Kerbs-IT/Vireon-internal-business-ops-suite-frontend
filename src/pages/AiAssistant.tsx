import { useState, useRef, useEffect, type FormEvent, useContext } from "react";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  text: string;
  time: string;
  matches?: string[];
  error?: boolean;
}

interface QueryResponse {
  answer: string;
  matches?: string[];
}

interface WeeklySummaryResponse {
  summary: string;
}

const SUGGESTIONS: string[] = [
  "Which of my tasks are overdue?",
  "What is due this week?",
  "How many leave days do I have left?",
  "Who is on leave this week?",
];

// TODO: replace with the logged-in user's first name from your auth context.

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function errorText(err: unknown): string {
  if (isAxiosError<{ message?: string }>(err)) {
    if (err.code === "ECONNABORTED")
      return "The AI took too long to respond. Please try again.";
    if (err.response?.status === 422)
      return "Please keep your question under 300 characters.";
    return (
      err.response?.data?.message ?? "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}

function SparkleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6L22.5 16.5l-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13zM6 14l.7 2 2 .7-2 .7L6 19.5l-.7-2.1-2-.7 2-.7L6 14z" />
    </svg>
  );
}

function Avatar({ role,first_name }: { role: Role, first_name : string }) {
  if (role === "assistant") {
    return (
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm">
        <SparkleIcon className="size-4" />
      </div>
    );
  }
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white shadow-sm">
      {first_name[0]}
    </div>
  );
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { user } = useContext(AuthContext);


  // Scroll to the newest message whenever the chat changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function addMessage(msg: Omit<ChatMessage, "time">) {
    setMessages((prev) => [...prev, { ...msg, time: now() }]);
  }

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    addMessage({ role: "user", text: q });
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post<QueryResponse>(
        "/ai/query",
        { question: q },
        { timeout: 40000 },
      );
      addMessage({
        role: "assistant",
        text: data.answer,
        matches: data.matches ?? [],
      });
    } catch (err) {
      addMessage({ role: "assistant", text: errorText(err), error: true });
    } finally {
      setLoading(false);
    }
  }

  async function weeklySummary() {
    if (loading) return;
    addMessage({ role: "user", text: "Give me my weekly summary" });
    setLoading(true);

    try {
      const { data } = await api.get<WeeklySummaryResponse>(
        "/ai/weekly-summary",
        { timeout: 40000 },
      );
      addMessage({ role: "assistant", text: data.summary });
    } catch (err) {
      addMessage({ role: "assistant", text: errorText(err), error: true });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(input);
  }

  const chipClass =
    "rounded-full border border-orange-100 bg-white px-3.5 py-1.5 text-xs text-gray-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-br from-white via-white to-orange-50/50">
      {/* Messages / empty state */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30">
              <SparkleIcon className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {greeting()}, {user.first_name}
            </h2>
            <p className="mt-1 font-serif text-lg italic text-orange-600">
              How can I help you today?
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  disabled={loading}
                  onClick={() => ask(s)}
                  className={chipClass}
                >
                  {s}
                </button>
              ))}
              <button
                disabled={loading}
                onClick={weeklySummary}
                className={chipClass}
              >
                Weekly summary
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <Avatar
                      role="assistant"
                      first_name={user.first_name ?? "Guest"}
                    />
                  )}

                  <div
                    className={`flex max-w-[80%] flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "rounded-tr-md bg-gradient-to-br from-indigo-400 to-violet-500 text-white"
                          : m.error
                            ? "rounded-tl-md border border-red-200 bg-red-50 text-red-700"
                            : "rounded-tl-md border border-gray-200 bg-white text-gray-800"
                      }`}
                    >
                      {m.text}

                      {m.matches && m.matches.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.matches.map((name) => (
                            <button
                              key={name}
                              disabled={loading}
                              onClick={() =>
                                ask(
                                  `What's the status of the project "${name}"?`,
                                )
                              }
                              className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="mt-1 text-[10px] text-gray-400">
                      {m.time}
                    </span>
                  </div>

                  {isUser && (
                    <Avatar
                      role="user"
                      first_name={user.first_name ?? "Guest"}
                    />
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <Avatar
                  role="assistant"
                  first_name={user.first_name ?? "Guest"}
                />
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3.5 shadow-sm">
                  <span className="size-1.5 animate-bounce rounded-full bg-orange-400" />
                  <span className="size-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-3 pt-2 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            maxLength={300}
            disabled={loading}
            className="flex-1 bg-transparent px-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-gray-400">
          AI responses may be inaccurate. Verify important information.
        </p>
      </div>
    </div>
  );
}
