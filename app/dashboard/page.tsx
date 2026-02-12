'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCost } from '@/lib/pricing';

// Types
interface Transaction {
  id: string;
  action_type: string;
  action_details: string;
  cost: number;
  status: string;
  created_at: string;
  metadata?: {
    duration?: number;
    fps?: number;
    prompt?: string;
    model?: string;
    [key: string]: any;
  };
}

// Action type icons and colors
const ACTION_CONFIG: Record<string, { icon: string; color: string; bgColor: string }> = {
  generation: { 
    icon: '🎨', 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  export: { 
    icon: '📤', 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  upscale: { 
    icon: '🔍', 
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  animation: { 
    icon: '✨', 
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
};

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

// Wallet Widget Component
function WalletWidget({ balance, isLoading }: { balance: number; isLoading: boolean }) {
  return (
    <div className="bg-gradient-to-br from-electric-blue/20 to-purple-500/20 border border-electric-blue/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Credit Balance</h2>
        <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
          <span className="text-xl">💳</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-12 bg-gray-800 rounded animate-pulse"></div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">
            {formatCost(balance)}
          </span>
          <span className="text-gray-400 text-sm">available</span>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Account Status</span>
          <span className="text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

// Transaction Card Component
function TransactionCard({ transaction }: { transaction: Transaction }) {
  const config = ACTION_CONFIG[transaction.action_type] || ACTION_CONFIG.generation;
  
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900 transition-colors">
      {/* Icon */}
      <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className="text-2xl">{config.icon}</span>
      </div>
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white truncate">
            {transaction.action_details}
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            transaction.status === 'completed' 
              ? 'bg-green-500/20 text-green-400'
              : transaction.status === 'failed'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {transaction.status}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-0.5">
          {formatRelativeTime(transaction.created_at)}
        </p>
      </div>
      
      {/* Cost */}
      <div className="text-right flex-shrink-0">
        <span className={`font-semibold ${
          transaction.cost < 0 ? 'text-red-400' : 'text-green-400'
        }`}>
          {transaction.cost < 0 ? '-' : '+'}{formatCost(Math.abs(transaction.cost))}
        </span>
      </div>
    </div>
  );
}

// Activity Feed Component
function ActivityFeed({ transactions, isLoading }: { transactions: Transaction[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-900/50 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-900/30 rounded-xl">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-400">No transactions yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Generate an image or export a GIF to see activity here
        </p>
        <Link 
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-electric-blue text-dark font-medium rounded-lg hover:bg-electric-blue/90 transition-colors"
        >
          Create Something
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {transactions.map(tx => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}

// Stats Card Component
function StatsCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch balance
        const balanceRes = await fetch('/api/balance?userId=demo-user-001');
        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          setBalance(balanceData.balance || 0);
        }
        
        // Fetch transactions
        const txRes = await fetch('/api/transactions/history?userId=demo-user-001');
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.transactions || []);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalSpent = transactions
    .filter(tx => tx.cost < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.cost), 0);
  
  const generationCount = transactions.filter(tx => tx.action_type === 'generation').length;
  const exportCount = transactions.filter(tx => tx.action_type === 'export').length;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Usage Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">
                Track your credit usage and transaction history
              </p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 bg-electric-blue text-dark font-medium rounded-lg hover:bg-electric-blue/90 transition-colors"
            >
              ← Back to Studio
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Stats */}
          <div className="space-y-6">
            {/* Wallet Widget */}
            <WalletWidget balance={balance} isLoading={isLoading} />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatsCard 
                label="Images" 
                value={generationCount.toString()} 
                icon="🎨" 
              />
              <StatsCard 
                label="Exports" 
                value={exportCount.toString()} 
                icon="📤" 
              />
            </div>
            
            {/* Total Spent */}
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-white">{formatCost(totalSpent)}</p>
              <p className="text-xs text-gray-500 mt-2">
                Across {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              {transactions.length > 0 && (
                <span className="text-sm text-gray-400">
                  {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <ActivityFeed 
              transactions={transactions} 
              isLoading={isLoading} 
            />
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong className="text-gray-400">No surprises.</strong> Every action shows its cost upfront.
          </p>
        </div>
      </div>
    </div>
  );
}