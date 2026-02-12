import { NextRequest, NextResponse } from 'next/server';
import { getTransactionHistory } from '@/lib/supabase/db/transactions';
import { getUserBalance } from '@/lib/supabase/db/users';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get transaction history
    const transactions = await getTransactionHistory(userId, limit, offset);

    // Get current balance
    const balance = await getUserBalance(userId);

    return NextResponse.json({
      transactions,
      balance,
      hasMore: transactions.length === limit
    });

  } catch (error) {
    console.error('Transaction history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
}