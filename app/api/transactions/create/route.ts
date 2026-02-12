import { NextRequest, NextResponse } from 'next/server';
import { createTransaction } from '@/lib/supabase/db/transactions';
import { getUserBalance, ensureUserExists } from '@/lib/supabase/db/users';
import { hasEnoughBalance } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, actionType, actionDetails, cost, metadata, status } = body;

    // Validate required fields
    if (!userId || !actionType || !actionDetails || cost === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure user exists (create if first time)
    await ensureUserExists(userId, `user-${userId}@motionframe.app`);

    // Check balance if transaction will be completed immediately
    if (status !== 'pending' && status !== 'processing') {
      const balance = await getUserBalance(userId);
      if (!hasEnoughBalance(balance, cost)) {
        return NextResponse.json(
          { error: 'Insufficient balance', balance },
          { status: 402 } // Payment Required
        );
      }
    }

    // Create transaction
    const transaction = await createTransaction({
      userId,
      actionType,
      actionDetails,
      cost: -Math.abs(cost), // Ensure cost is negative
      status: status || 'completed',
      metadata
    });

    // Get updated balance
    const newBalance = await getUserBalance(userId);

    return NextResponse.json({
      transaction,
      balance: newBalance
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}