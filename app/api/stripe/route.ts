import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    const { userId } = auth();

    const user = await currentUser(); // получаем информацию о текущем пользователе

    if (!userId || !user) {
      return new NextResponse("Unathorized", { status: 401 });
    } // проверка наличия userId и user

    const userSubscription = await prismabd.userSubscription.findUnique({
      where: { userId },
    }); // в этой строке выполняется запрос к БД, пытаясь найти запись о подписке пользователя, используя его userId

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      }); // если у пользователя есть запись о подписке и в этой записи есть stripeCustomerId, то создается сессия Stripe Billing Portal, с использование stripeCustomerId. После создания сессии по-тель будет перенаправлен на settingsUrl

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // if we don't have a stripe subscription
    // оформление подписки через Stripe Checkout
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited AI Generations",
            },
            unit_amount: 2000, // 20$
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      }, // для идентификации пользователя (для связывания оплаты с конкретным пользователем)
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
