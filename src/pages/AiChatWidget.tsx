import { useState } from "react";
import { useLocation } from "react-router-dom";
import AiAssistant, { SparkleIcon } from "@/pages/AiAssistant";

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // No pop-up on the full AI page. Change this to your route.
  const hiddenOn = ["/ai-assistant", "/login", "/print"];
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      {/* Chat panel. Kept mounted and only hidden, so the conversation survives closing. */}
      <div
        className={`${open ? "flex" : "hidden"} fixed bottom-24 right-4 z-50 h-[560px] max-h-[calc(100vh-7rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between bg-gradient-to-br from-orange-500 to-rose-500 px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SparkleIcon className="size-4" />
            AI Assistant
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="rounded p-1 text-lg leading-none transition hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <AiAssistant compact />
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="fixed bottom-4 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:brightness-110"
      >
        {open ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <SparkleIcon className="size-6" />
        )}
      </button>
    </>
  );
}
