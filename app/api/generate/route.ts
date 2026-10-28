
import { NextResponse } from "next/server";

const allowedTones = ["Playful", "Thoughtful", "Friendly", "Flirty"] as const;

type Tone = (typeof allowedTones)[number];

type Spark = {
  label: string;
  message: string;
  reason: string;
};

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, maxLength)
    : "";
}

function buildSparks(
  interests: string,
  context: string,
  tone: Tone
): Spark[] {
  const topics = interests
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const topic = topics[0] || "music";
  const secondTopic = topics[1];
  const sharedTopic = secondTopic ? `${topic} and ${secondTopic}` : topic;

  const combined = `${interests} ${context}`.toLowerCase();
  const musicRelated =
    /\bmusic\b|\bsong\b|\bsongs\b|\bsing\b|\bsinger\b|\bconcert\b|\bindie\b|\bplaylist\b/.test(
      combined
    );

  const activity = musicRelated
    ? "listening to music"
    : `exploring ${topic}`;

  const ideas: Record<Tone, Spark[]> = {
    Playful: [
      {
        label: "The playful opener",
        message: `Important question: what's one ${topic} recommendation everyone should try?`,
        reason: "A light question makes it easy to share a favorite.",
      },
      {
        label: "The fun debate",
        message: `Let's settle something: what's the best part of ${topic}, and what's overrated?`,
        reason: "A friendly debate adds personality to the conversation.",
      },
      {
        label: "The unexpected question",
        message: `If we had a free afternoon for ${activity}, what would your ideal plan look like?`,
        reason: "An imaginative question gives the conversation room to grow.",
      },
    ],
    Thoughtful: [
      {
        label: "Beyond the basics",
        message: `What's something about ${topic} you could talk about for hours?`,
        reason: "It invites them to share something they genuinely care about.",
      },
      {
        label: "A little deeper",
        message: `Has ${topic} ever changed the way you see something in your life?`,
        reason: "An open question can lead to a meaningful exchange.",
      },
      {
        label: "Find a connection",
        message: `What first got you interested in ${sharedTopic}?`,
        reason: "It helps uncover the story behind someone's interests.",
      },
    ],
    Friendly: [
      {
        label: "Easy conversation",
        message: `Hey! What's your favorite thing about ${topic}?`,
        reason: "A warm, straightforward question is easy to answer.",
      },
      {
        label: "Share a recommendation",
        message: `I'd love a recommendation for ${topic}. What should a beginner try first?`,
        reason: "Recommendations make sharing interests feel natural.",
      },
      {
        label: "Get to know them",
        message: `Outside of ${topic}, what have you been enjoying lately?`,
        reason: "It gives the other person room to introduce a new topic.",
      },
    ],
    Flirty: [
      {
        label: "A little charm",
        message: `I was going to think of a clever opener, but asking about your taste in ${topic} seemed like a better start 😉`,
        reason: "Playful honesty adds warmth without applying pressure.",
      },
      {
        label: "The recommendation challenge",
        message: `Recommend me one ${topic} favorite. If I love it, I'll owe you a recommendation back 😉`,
        reason: "A small challenge creates an easy reason to keep chatting.",
      },
      {
        label: "A hint of chemistry",
        message: `If we planned an outing around ${topic}, what would you choose?`,
        reason: "It opens the door to a shared activity without making assumptions.",
      },
    ],
  };

  const results = ideas[tone].map((spark) => ({ ...spark }));

  if (context) {
    results[2] = {
      label: "Based on your context",
      message: musicRelated
        ? "What's one song you'd share to help someone understand your vibe?"
        : `You mentioned "${context.slice(0, 100)}". What's the story behind that?`,
      reason: "Using your context makes the opener feel more personal.",
    };
  }

  return results;
}

function buildReplies(tone: Tone): Spark[] {
  const replies: Record<Tone, Spark[]> = {
    Playful: [
      {
        label: "Keep it fun",
        message: "Haha, now I need to know more 😄 Tell me more!",
        reason: "Keeps the exchange light and invites another response.",
      },
      {
        label: "Curious follow-up",
        message: "Wait, what's the story behind that? 👀",
        reason: "Shows curiosity without making the conversation feel forced.",
      },
      {
        label: "Keep the spark",
        message: "Okay, I have a follow-up question for you!",
        reason: "Creates a natural opening for the next message.",
      },
    ],
    Thoughtful: [
      {
        label: "Understand their perspective",
        message: "That's interesting. What makes you feel that way?",
        reason: "Encourages a more meaningful exchange.",
      },
      {
        label: "Explore the story",
        message: "I'd love to hear more about that. How did it start?",
        reason: "Invites them to share their experience.",
      },
      {
        label: "Build a connection",
        message: "What matters most to you about it?",
        reason: "Gives the conversation room to go deeper.",
      },
    ],
    Friendly: [
      {
        label: "Warm and easy",
        message: "That sounds interesting! Tell me a little more 😊",
        reason: "Keeps the conversation welcoming.",
      },
      {
        label: "Find common ground",
        message: "Nice! What do you like most about it?",
        reason: "Shows interest and encourages them to elaborate.",
      },
      {
        label: "Keep things moving",
        message: "That's cool! What else have you been enjoying lately?",
        reason: "Naturally opens up another topic.",
      },
    ],
    Flirty: [
      {
        label: "A little charm",
        message: "Okay, I have to admit, I'm enjoying this conversation 😉",
        reason: "Adds warmth without assuming they feel the same.",
      },
      {
        label: "Playful curiosity",
        message: "You're making me curious now. What else should I know about you?",
        reason: "Shows interest while letting them choose what to share.",
      },
      {
        label: "A shared moment",
        message: "Now you've got me curious! What would you recommend we try sometime?",
        reason: "Opens the door to a shared activity without pressure.",
      },
    ],
  };

  return replies[tone].map((spark) => ({ ...spark }));
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Please send valid form data." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;
    const interests = clean(input.interests, 300);
    const context = clean(input.context, 500);
    const reply = clean(input.reply, 500);
    const mode = clean(input.mode, 20);
    const rawTone = clean(input.tone, 30);

    if (!allowedTones.some((item) => item === rawTone)) {
      return NextResponse.json(
        { error: "Please choose a valid conversation tone." },
        { status: 400 }
      );
    }

    const tone = rawTone as Tone;

    if (mode === "reply") {
      if (!reply) {
        return NextResponse.json(
          { error: "Paste the message you received first." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        sparks: buildReplies(tone),
        mode: "local",
      });
    }

    if (mode && mode !== "generate") {
      return NextResponse.json(
        { error: "That conversation mode is not supported." },
        { status: 400 }
      );
    }

    if (!interests && !context) {
      return NextResponse.json(
        { error: "Add an interest or a little context first ✨" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sparks: buildSparks(interests, context, tone),
      mode: "local",
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't process that request. Please try again." },
      { status: 400 }
    );
  }
}
