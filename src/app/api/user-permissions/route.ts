import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/user-permissions
 *
 * Fetches user permission flags from Clerk privateMetadata.
 * Returns canUseDebugMode: true if the user has debug mode enabled.
 * For unauthenticated users or errors, returns canUseDebugMode: false.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ canUseDebugMode: false });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const canUseDebugMode = user.privateMetadata?.canUseDebugMode === true;

    return NextResponse.json({ canUseDebugMode });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json({ canUseDebugMode: false });
  }
}
