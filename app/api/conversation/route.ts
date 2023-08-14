import { auth } from "@clerk/nextjs"; // аутентификация с помощью clerk
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai"; // для настройки взаимодействия с OPENAI.

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  // функция POST ожидает HTTP POST запрос с данными в формате JSON. Проверяет наличие пользователя (userId) и наличие необходимых данных (messages). Если какая-то проверка не проходит, то возвращает HTTP-ответ с соответствующим кодом ошибки и сообщением.
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    }); // Если все проверки проходят, то функция отправляет запрос к OpenAI API с использованием метода "createChatCompletion". Он принимает модель (model) и сообщение (messages)

    return NextResponse.json(response.data.choices[0].message); // ответ от OpenAI API содержит текст ответа, который возвращается как JSON-ответ от сервера.
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 }); // В случае ошибки она логируется и возвращает HTTP-ответ с кодом 500
  }
}
