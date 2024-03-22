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

  // Завершение сеанса оформления заказа
  const session = event.data.object as Stripe.Checkout.Session; // создаю переменную, которая извлекает объект сессии оформления заказа ("Stripe.Checkout.Session") из "event.data.object". Вебхук Stripe передает информацию о событии в виде объекта, и здесь я извлекаю объект сесси офомления заказа.

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ); // проверкан на успешность завершения заказа
    // "stripe.subscriptions.retrieve" - метод запрашивает данные о подписке

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    // prisma subscription
    await prismabd.userSubscription.create({
      // здесь выполняется создание записи о подписке пользователя в БД. Метод "create" создает новую в таблице БД
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await prismabd.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
