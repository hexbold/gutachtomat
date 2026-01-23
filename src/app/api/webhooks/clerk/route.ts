import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { randomBytes } from 'crypto';

/**
 * Generate a random 256-bit encryption key for client-side AES-256-GCM encryption.
 * Returns a Base64-encoded 32-byte key.
 */
function generateEncryptionKey(): string {
  const key = randomBytes(32); // 256 bits
  return key.toString('base64');
}

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();

  // Get the Webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id } = evt.data;
    const client = await clerkClient();

    try {
      // Generate unique encryption key for this user's client-side encryption
      const encryptionKey = generateEncryptionKey();

      // Set default metadata for new users
      await client.users.updateUser(id, {
        publicMetadata: {
          role: 'user',
          tier: 'free',
          status: 'new',
        },
        privateMetadata: {
          freeForever: false,
          canUseDebugMode: false,
          accountType: 'standard',
          stripeCustomerId: null,
          subscriptionId: null,
          isCancelled: false,
          trialEndsAt: null,
          subscriptionStartedAt: null,
          subscriptionEndsAt: null,
          lastPaymentAt: null,
          createdAt: new Date().toISOString(),
          // Encryption key for client-side AES-256-GCM encryption of Gutachten data
          encryptionKey,
        },
      });

      console.log(`✅ Metadata set for new user: ${id}`);
    } catch (error) {
      console.error('Error setting user metadata:', error);
      return new Response('Error: Could not set metadata', {
        status: 500,
      });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
