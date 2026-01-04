import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech } from "ai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const { audio } = await experimental_generateSpeech({
      model: openai.speech("tts-1"),
      text,
    });

    // ✅ Convert to a standard Uint8Array with a valid ArrayBuffer
    const fixedAudio = Uint8Array.from(audio.uint8Array);

    // ✅ Option 1: Use a Blob
    const blob = new Blob([fixedAudio], {
      type: audio.mediaType || "audio/mpeg",
    });

    // return new Response(blob, {
    //   headers: {
    //     "Content-Type": audio.mediaType || "audio/mpeg",
    //   },
    // });

    // ✅ Option 2 (alternative): Send directly
    return new Response(fixedAudio, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech", error);
    return new Response("Error generating speech", { status: 500 });
  }
}
