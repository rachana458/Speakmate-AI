import { pipeline } from "@huggingface/transformers";

let generator: any = null;

async function getGenerator() {
    if (!generator) {
        generator = await pipeline(
            "text-generation",
            "onnx-community/Qwen2.5-0.5B-Instruct",
            {
                dtype: "q4",
                device: "webgpu",
            }
        );
    }

    return generator;
}

export async function generateAI(prompt: string): Promise<string> {
    const model = await getGenerator();

    const messages = [
        {
            role: "system",
            content:
                "You are SpeakMate, an English grammar exercise generator. Create different questions every time. Never repeat the same question.",
        },
        {
            role: "user",
            content: prompt,
        },
    ];

    const result = await model(messages, {
        max_new_tokens: 120,

        // This is the important change.
        // It makes the model choose different tokens.
        do_sample: true,

        temperature: 0.9,
        top_k: 50,
        top_p: 0.9,

        return_full_text: false,
    });

    console.log("RAW AI RESULT:", result);

    const generated = result?.[0]?.generated_text;

    if (typeof generated === "string") {
        return generated.trim();
    }

    if (Array.isArray(generated)) {
        const assistantMessage = [...generated]
            .reverse()
            .find(
                (message: any) =>
                    message?.role === "assistant" &&
                    typeof message?.content === "string"
            );

        if (assistantMessage?.content) {
            return assistantMessage.content.trim();
        }

        const lastMessage = [...generated]
            .reverse()
            .find(
                (message: any) =>
                    typeof message?.content === "string"
            );

        if (lastMessage?.content) {
            return lastMessage.content.trim();
        }
    }

    if (
        generated &&
        typeof generated === "object" &&
        typeof generated.content === "string"
    ) {
        return generated.content.trim();
    }

    return "";
}