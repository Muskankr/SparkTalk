
"use client";

import { useState } from "react";

type Tone = "Playful" | "Thoughtful" | "Friendly" | "Flirty";

type Spark = {
  label: string;
  message: string;
  reason: string;
};

const tones: {
  name: Tone;
  symbol: string;
  description: string;
}[] = [
  { name: "Playful", symbol: "✳", description: "Light and witty" },
  { name: "Thoughtful", symbol: "☾", description: "Meaningful" },
  { name: "Friendly", symbol: "♡", description: "Warm and easy" },
  { name: "Flirty", symbol: "✿", description: "Charming, not pushy" },
];

export default function Home() {
  const [interests, setInterests] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Playful");

  const [sparks, setSparks] = useState<Spark[]>([]);
  const [loading, setLoading] = useState(false);

  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySparks, setReplySparks] = useState<Spark[]>([]);

  const [error, setError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  async function generateSparks() {
    if (!interests.trim() && !context.trim()) {
      setError("Add an interest or a little context to get started ✨");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    setCopied(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, context, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status}).`);
      }

      if (
        !Array.isArray(data.sparks) ||
        data.sparks.length !== 3 ||
        !data.sparks.every(
          (item: Spark) =>
            item &&
            typeof item.label === "string" &&
            typeof item.message === "string" &&
            typeof item.reason === "string"
        )
      ) {
        throw new Error(
          "The conversation generator returned an unexpected response. Please try again."
        );
      }

      setSparks(data.sparks);
      setNotice("Three fresh sparks, made for your conversation.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateReplies() {
    if (!reply.trim()) {
      setReplyError("Paste the message you received first ✨");
      return;
    }

    setReplyLoading(true);
    setReplyError("");
    setCopied(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reply",
          reply,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status}).`);
      }

      if (
        !Array.isArray(data.sparks) ||
        data.sparks.length !== 3 ||
        !data.sparks.every(
          (item: Spark) =>
            item &&
            typeof item.label === "string" &&
            typeof item.message === "string" &&
            typeof item.reason === "string"
        )
      ) {
        throw new Error("Couldn't prepare the replies. Please try again.");
      }

      setReplySparks(data.sparks);
    } catch (err) {
      setReplyError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setReplyLoading(false);
    }
  }

  async function copyMessage(message: string, id: string) {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(id);
      window.setTimeout(() => {
        setCopied((current) => (current === id ? null : current));
      }, 1800);
    } catch {
      setError("Clipboard access failed. Please select and copy the message manually.");
      setReplyError("Clipboard access failed. Please select and copy the message manually.");
    }
  }

  function resetForm() {
    setInterests("");
    setContext("");
    setSparks([]);
    setReply("");
    setReplySparks([]);
    setError("");
    setReplyError("");
    setNotice("");
    setCopied(null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0c0913] text-[#f8f5ff] selection:bg-violet-400/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute right-[-180px] top-[22%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
        <div className="absolute bottom-[-260px] left-[35%] h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <header className="flex items-center justify-between border-b border-white/[0.08] py-5">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-3 text-left"
            aria-label="SparkTalk home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/15 text-xl text-violet-200 shadow-lg shadow-violet-950/30">
              ✳
            </span>
            <span className="text-lg font-bold tracking-tight">
              spark<span className="text-violet-300">talk</span>
            </span>
          </button>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/65">
            Your conversation companion
          </span>
        </header>

        <section className="grid items-center gap-12 py-12 sm:py-16 lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-4 py-2 text-xs font-medium text-violet-200">
              <span>✦</span> Less awkward. More authentic.
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
              Skip the
              <br />
              <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-300 bg-clip-text text-transparent">
                small talk.
              </span>
              <br />
              Find your spark.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/55 sm:text-lg">
              Great conversations don&apos;t need a perfect line. Find a
              natural opener, discover shared interests, and let the
              conversation become your own.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "✦ Personalized openers",
                "♡ Respectful by design",
                "☁ No pressure",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.06] bg-white/[0.045] px-4 py-2.5 text-xs text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-2 text-sm text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
              Made for meaningful human connection
            </div>

            <div className="mt-12 hidden max-w-md grid-cols-3 gap-4 border-t border-white/[0.08] pt-6 sm:grid">
              <div>
                <p className="text-xl font-semibold">Your vibe</p>
                <p className="mt-1 text-xs text-white/40">You choose the tone</p>
              </div>
              <div>
                <p className="text-xl font-semibold">3 sparks</p>
                <p className="mt-1 text-xs text-white/40">Different ways to start</p>
              </div>
              <div>
                <p className="text-xl font-semibold">No scripts</p>
                <p className="mt-1 text-xs text-white/40">Just a little inspiration</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-[28px] border border-white/[0.11] bg-[#171220]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">
                    The spark studio
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Start something good.
                  </h2>
                  <p className="mt-2 text-sm text-white/45">
                    A little context can make a big difference.
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-300/10 text-2xl">
                  ✨
                </span>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void generateSparks();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="interests"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    What do you have in common?
                  </label>
                  <input
                    id="interests"
                    value={interests}
                    onChange={(event) => setInterests(event.target.value)}
                    maxLength={300}
                    placeholder="e.g. music, travel, photography"
                    className="w-full rounded-xl border border-white/[0.11] bg-white/[0.045] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70 focus:bg-violet-300/[0.04] focus:ring-4 focus:ring-violet-400/[0.08]"
                  />
                  <p className="mt-2 text-xs text-white/35">
                    Separate multiple interests with commas.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="context"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    Any conversation context?{" "}
                    <span className="font-normal text-white/35">(optional)</span>
                  </label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(event) => setContext(event.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="e.g. We matched because we both love indie music..."
                    className="w-full resize-y rounded-xl border border-white/[0.11] bg-white/[0.045] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-white/25 focus:border-violet-400/70 focus:bg-violet-300/[0.04] focus:ring-4 focus:ring-violet-400/[0.08]"
                  />
                  <p className="mt-1 text-right text-xs text-white/30">
                    {context.length}/500
                  </p>
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-white/85">
                    Choose your vibe
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {tones.map((item) => {
                      const active = tone === item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setTone(item.name)}
                          title={item.description}
                          className={`rounded-xl border px-2 py-3 text-sm transition duration-200 hover:-translate-y-0.5 ${
                            active
                              ? "border-violet-300/60 bg-violet-300/15 text-violet-100 shadow-lg shadow-violet-950/20"
                              : "border-white/[0.09] bg-white/[0.025] text-white/55 hover:border-white/20 hover:text-white/90"
                          }`}
                        >
                          <span className="mr-1">{item.symbol}</span>
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-4 text-sm leading-6 text-rose-200"
                  >
                    <p className="font-semibold">Let&apos;s fix that</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-300 to-[#c7b4ff] px-5 py-4 font-semibold text-[#171020] shadow-lg shadow-violet-950/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/30 focus:outline-none focus:ring-4 focus:ring-violet-300/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171020]/30 border-t-[#171020]" />
                      Finding your spark...
                    </>
                  ) : (
                    <>
                      <span className="transition group-hover:rotate-12">✦</span>
                      {sparks.length ? "Generate new sparks" : "Find my conversation spark"}
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs leading-5 text-white/35">
                Thoughtful inspiration, not a script. Keep it you.
              </p>
            </div>
          </div>
        </section>

        {sparks.length > 0 && (
          <section
            aria-live="polite"
            className="border-t border-white/[0.08] py-12 sm:py-16"
          >
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
                  Made for your moment
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your conversation sparks<span className="text-violet-300">.</span>
                </h2>
                <p className="mt-3 text-sm text-white/45">
                  Pick the one that sounds most like you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void generateSparks()}
                disabled={loading}
                className="self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80 transition hover:border-violet-300/40 hover:bg-violet-300/[0.08] disabled:opacity-50 sm:self-auto"
              >
                ↻ Try another set
              </button>
            </div>

            {notice && (
              <p className="mb-5 text-sm text-emerald-300/90">{notice}</p>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              {sparks.map((spark, index) => (
                <article
                  key={`${spark.label}-${index}`}
                  className="group flex flex-col rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.055] to-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:shadow-xl hover:shadow-violet-950/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.09] text-lg text-violet-200">
                      {["✧", "☾", "♡"][index]}
                    </span>
                    <span className="text-xs text-white/35">
                      SPARK 0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{spark.label}</h3>
                  <p className="mt-4 flex-1 text-base leading-7 text-white/85">
                    “{spark.message}”
                  </p>

                  <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/15 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-300">
                      Why it works
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {spark.reason}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void copyMessage(spark.message, `spark-${index}`)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/[0.08] px-4 py-3 text-sm font-medium text-violet-100 transition hover:border-violet-300/50 hover:bg-violet-300/[0.15]"
                  >
                    {copied === `spark-${index}` ? "✓ Copied to clipboard" : "▢ Copy message"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Reply Coach */}
        <section
          id="reply-coach"
          className="border-t border-white/[0.08] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-4xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
                The conversation continues
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                They replied. Now what?
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/50 sm:text-base">
                Not sure what to say next? Paste a message you received,
                choose your vibe above, and explore three ways to continue
                the conversation naturally.
              </p>
            </div>

            <div className="mt-7 rounded-3xl border border-white/[0.1] bg-[#171220]/75 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-7">
              <label
                htmlFor="reply"
                className="mb-3 block text-sm font-medium text-white/85"
              >
                What did they say?
              </label>
              <textarea
                id="reply"
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setReplyError("");
                }}
                maxLength={500}
                rows={4}
                placeholder="e.g. I love discovering new music! What's your favorite band?"
                className="w-full resize-y rounded-xl border border-white/[0.11] bg-white/[0.045] px-4 py-4 text-sm leading-7 outline-none transition placeholder:text-white/25 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/[0.08]"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-white/35">
                  Your message is used to trigger reply suggestions.
                </p>
                <span className="shrink-0 text-xs text-white/35">
                  {reply.length}/500
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void generateReplies()}
                  disabled={replyLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-300 to-[#c7b4ff] px-5 py-4 font-semibold text-[#171020] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {replyLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171020]/30 border-t-[#171020]" />
                      Finding your next words...
                    </>
                  ) : (
                    "✦ Help me reply"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReply("");
                    setReplySparks([]);
                    setReplyError("");
                    setCopied(null);
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  Clear
                </button>
              </div>

              {replyError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-4 text-sm leading-6 text-rose-200"
                >
                  {replyError}
                </div>
              )}
            </div>

            {replySparks.length > 0 && (
              <div className="mt-9" aria-live="polite">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                    Your next move
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Three ways to reply<span className="text-violet-300">.</span>
                  </h3>
                  <p className="mt-2 text-sm text-white/45">
                    Choose the response that feels most like you.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {replySparks.map((spark, index) => (
                    <article
                      key={`reply-${spark.label}-${index}`}
                      className="flex flex-col rounded-2xl border border-white/[0.09] bg-gradient-to-b from-violet-300/[0.07] to-white/[0.02] p-5 transition hover:border-violet-300/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-300/[0.1] text-violet-200">
                          {["✧", "☾", "♡"][index]}
                        </span>
                        <span className="text-xs text-white/35">
                          REPLY 0{index + 1}
                        </span>
                      </div>

                      <h4 className="mt-4 font-semibold">{spark.label}</h4>
                      <p className="mt-3 flex-1 text-sm leading-7 text-white/80">
                        “{spark.message}”
                      </p>

                      <p className="mt-4 text-xs leading-6 text-white/45">
                        {spark.reason}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          void copyMessage(spark.message, `reply-${index}`)
                        }
                        className="mt-5 w-full rounded-xl border border-violet-300/20 bg-violet-300/[0.08] px-3 py-3 text-sm text-violet-100 transition hover:bg-violet-300/[0.15]"
                      >
                        {copied === `reply-${index}` ? "✓ Copied" : "▢ Copy reply"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-5 text-xs leading-6 text-white/35">
              SparkTalk offers conversation templates, not guaranteed interpretations
              of someone&apos;s intentions. Read each suggestion and make it your own.
            </p>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/[0.08] py-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-violet-200">✳ sparktalk</span>
            {" "}· Better conversations, one spark at a time.
          </p>
          <p>Built for AFFECIO HACKS ’26 · From Match to Conversation</p>
        </footer>
      </div>
    </main>
  );
}
