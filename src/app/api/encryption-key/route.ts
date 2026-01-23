import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/encryption-key
 *
 * Fetches the user's encryption key from Clerk privateMetadata.
 * The key is generated when the user signs up (in the Clerk webhook)
 * and stored securely in Clerk's privateMetadata.
 *
 * Returns:
 * - 200: { key: string } - Base64-encoded 256-bit encryption key
 * - 401: Not authenticated
 * - 404: Encryption key not found (user needs key generated)
 * - 500: Server error
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      );
    }

    // Fetch user's privateMetadata from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Get encryption key from privateMetadata
    const encryptionKey = user.privateMetadata?.encryptionKey as string | undefined;

    if (!encryptionKey) {
      // Key not found - this shouldn't happen if webhook is set up correctly
      console.error(`Encryption key not found for user: ${userId}`);
      return NextResponse.json(
        { error: 'Encryption key not found. Please contact support.' },
        { status: 404 }
      );
    }

    // Return the key (only accessible to authenticated user)
    return NextResponse.json({ key: encryptionKey });
  } catch (error) {
    console.error('Error fetching encryption key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch encryption key' },
      { status: 500 }
    );
  }
}
