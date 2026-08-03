import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

async function verifyWebhook(request: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing Svix headers");
  }

  const body = await request.text();
  const wh = new Webhook(webhookSecret!);
  return wh.verify(body, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  }) as Record<string, unknown>;
}

function extractEmail(data: Record<string, unknown>): string | null {
  const emailAddresses = data.email_addresses as
    | Array<{ email_address: string }>
    | undefined;
  if (emailAddresses && emailAddresses.length > 0) {
    return emailAddresses[0].email_address;
  }
  return null;
}

function extractImage(data: Record<string, unknown>): string | null {
  const imageUrl = data.image_url;
  if (typeof imageUrl === "string") return imageUrl;
  return null;
}

function extractName(data: Record<string, unknown>): string | null {
  const firstName = data.first_name as string | undefined;
  const lastName = data.last_name as string | undefined;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return null;
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await verifyWebhook(request);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = payload.type as string;
  const data = payload.data as Record<string, unknown>;
  const clerkId = data.id as string;

  if (!clerkId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    switch (eventType) {
      case "user.created": {
        const email = extractEmail(data);
        if (!email) {
          console.error("user.created missing email for clerkId:", clerkId);
          return NextResponse.json(
            { error: "Email required" },
            { status: 400 }
          );
        }

        await prisma.user.upsert({
          where: { clerkId },
          create: {
            clerkId,
            email,
            name: extractName(data),
            image: extractImage(data),
            emailVerified: true,
          },
          update: {
            email,
            name: extractName(data),
            image: extractImage(data),
            emailVerified: true,
          },
        });
        break;
      }

      case "user.updated": {
        const email = extractEmail(data);
        if (!email) {
          console.error("user.updated missing email for clerkId:", clerkId);
          return NextResponse.json(
            { error: "Email required" },
            { status: 400 }
          );
        }

        await prisma.user.upsert({
          where: { clerkId },
          create: {
            clerkId,
            email,
            name: extractName(data),
            image: extractImage(data),
            emailVerified: true,
          },
          update: {
            email,
            name: extractName(data),
            image: extractImage(data),
            emailVerified: true,
          },
        });
        break;
      }

      case "user.deleted": {
        await prisma.user.deleteMany({ where: { clerkId } });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Error processing ${eventType}:`, err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
