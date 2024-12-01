import { NextResponse } from "next/server";
import Stripe from "stripe"

import { headers } from "next/headers";
import { createOrUpdateSubscription, updateUserPoints } from "@/utils/db/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia"
})

export async function POST(req:Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string;

    if(!signature) {
        console.log("No Stripe signature found")
        return NextResponse.json({error: "No Stripe signature found"}, {status: 400})
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    }

    catch(err) {
        console.error("Webhook error:", err)
        return NextResponse.json({error: "Webhook error"}, {status: 400})
    }

    if(event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id as string
        const subscriptionId = session.subscription as string

        if(!userId || !subscriptionId) {
            console.error("Missing userId or subscriptionId", {session})
            return NextResponse.json({error: "Missing userId or subscriptionId"}, {status: 400})
        }

        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            if(!subscription.items.data.length) {
                console.error("No subscription items found", {subscription})
                return NextResponse.json({error: "No subscription items found"}, {status: 400})
            }

            const priceId = subscription.items.data[0].price.id

            let plan: string;
            let pointsToAdd: number;

            switch(priceId) {
                case "price_1QRE6wK68ZrnuvMgMCaed5fj":
                    plan = "Basic"
                    pointsToAdd = 100
                    break
                case "price_1QREbGK68ZrnuvMgNYtX6PMv":
                    plan = "Pro"
                    pointsToAdd = 500
                    break
                case "price_1QREcWK68ZrnuvMgtQGIM0x0":
                    plan = "Enterprise"
                    pointsToAdd = 1000
                    break
                default:
                    console.error("Unknown priceId", {priceId})
                    return NextResponse.json({error: "Unknown priceId"}, {status: 400})
            }

            const updateSubscription = await createOrUpdateSubscription(
                userId,
                subscriptionId,
                plan,
                'active',
                new Date(subscription.current_period_start * 1000),
                new Date(subscription.current_period_end * 1000)
            )

            if(!updateSubscription) {
                console.error("Failed to create or update subscription")
                return NextResponse.json({error: "Failed to create or update subscription"}, {status: 400})
            }

            await updateUserPoints(userId, pointsToAdd)
        }

        catch(err) {
            console.error("Error creating or updating user: ", err);
            return NextResponse.json({error: "Error creating or updating user"}, {status: 500})
        }
    }

    return NextResponse.json({received: true})
}