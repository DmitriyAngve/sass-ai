import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  // вебхуки Stripe обычно отправляются с помощью HTTP POST-запросов
  const body = await req.text(); // считываем тело запроса, и сохраняет его в переменной body. Вебхук Stripe передает данные в теле запроса, и этот код получает их
  const signature = headers().get("Stripe-Signature") as string; // Эта строка извлекает значение HTTP заголовка с имененм "Stripe-Signature" из запроса, ищет в соответствии с "Stripe-Signature".

  let event: Stripe.Event; // строка объявляет переменную "event", которая будет содержать объект "Stripe.Event". Это объект, представляющий вебхук "Stripe", и в нем содержится информация о событии, которое произошло.

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    ); // Это проверка подлинности вебхука
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
