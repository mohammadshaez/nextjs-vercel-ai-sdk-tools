import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          style: "vivid",
          quality: "hd",
        },
      },
    });

    return Response.json(image.base64);
  } catch (error) {
    console.error("Error generating image", error);

    let message = "Failed to generate image";

    // If OpenAI error, try to extract the message
    if (error instanceof Error) {
      if (typeof (error as any).responseBody === "string") {
        try {
          const body = JSON.parse((error as any).responseBody);
          message = body.error?.message || message;
        } catch (_) {
          // fallback to default message
        }
      } else {
        message = error.message;
      }
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
