import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log(prompt, "prompt");
    const result = streamText({
      // taking more tokens
      // model: openai("gpt-5-nano"),
      model: openai("gpt-4.1-nano"),
      prompt,
    });

    // logging tokens
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating text", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}
// ErrorS
