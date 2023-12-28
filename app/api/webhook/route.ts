import dbConnect from "@/lib/dbConnect";
import UserOrganizationCountModel, {
  UserOrganizationCount,
} from "@/model/UserOrganizationCount";
import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

// This function handles "organization.created" and "organization.deleted" webhook events.
export async function POST(request: Request) {
  // Svix Webhook Verification Setup
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET is not defined in .env");
  }
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  await dbConnect();
  const payload = await request.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  const wh = new Webhook(WEBHOOK_SECRET);
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Verification failed", { status: 400 });
  }

  // Event Processing
  const { data, type } = payload;
  let organizationId = data?.id;
  if (!organizationId) {
    return Response.json(
      { success: false, message: "Missing organization ID" },
      { status: 400 }
    );
  }

  try {
    let updatedOrgCount;
    switch (type) {
      case "organization.created":
        updatedOrgCount = await updateOrganizationCreated(data);
        break;
      case "organization.deleted":
        updatedOrgCount = await updateOrganizationDeleted(organizationId);
        break;
      default:
        return Response.json(
          { success: false, message: "Unhandled event type" },
          { status: 400 }
        );
    }

    if (!updatedOrgCount) {
      return Response.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    // Update organization creation status based on count
    const orgCount = updatedOrgCount.organizationIds.length;
    await updateOrganizationCreationStatus(updatedOrgCount.userId, orgCount);

    return Response.json(
      {
        success: true,
        message: "Event processed successfully",
        organizationCount: orgCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing event:", error);
    return Response.json(
      { success: false, message: "Error processing event" },
      { status: 500 }
    );
  }
}

async function updateOrganizationCreated(
  data: any
): Promise<UserOrganizationCount | null> {
  const createdByUserId = data?.created_by;
  const organizationId = data?.id;
  return await UserOrganizationCountModel.findOneAndUpdate(
    { userId: createdByUserId },
    { $addToSet: { organizationIds: organizationId } },
    { new: true, upsert: true }
  );
}

async function updateOrganizationDeleted(
  organizationId: string
): Promise<UserOrganizationCount | null> {
  return await UserOrganizationCountModel.findOneAndUpdate(
    { organizationIds: organizationId },
    { $pull: { organizationIds: organizationId } },
    { new: true }
  );
}

async function updateOrganizationCreationStatus(
  userId: string,
  orgCount: number
): Promise<void> {
  if (orgCount >= 3) {
    await clerkClient.users.updateUser(userId, {
      createOrganizationEnabled: false,
    });
  } else {
    await clerkClient.users.updateUser(userId, {
      createOrganizationEnabled: true,
    });
  }
}
