import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { dish } = await req.json();

    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      prompt: `Generate recipes for ${dish}`,
      schema: recipeSchema,
    });

    // logging tokens
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    // return result.toUIMessageStreamResponse();
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating recipe", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}

// import { streamObject } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { recipeSchema } from "./schema";
// // import { recipeSchema } from "./schema";

// export async function POST(req: Request) {
//   try {
//     const { dish } = await req.json();

//     console.log({ dish });

//     const result = streamObject({
//       model: openai("gpt-4.1-nano"),
//       schema: recipeSchema,
//       prompt: `Generate a recipe for ${dish}`,
//     });

//     return result.toTextStreamResponse();
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     return new Response("Failed to generate recipe", { status: 500 });
//   }
// }
