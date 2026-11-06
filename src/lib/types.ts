// ============================================================================
// MY FITNESS - Core TypeScript Type Definitions
// ============================================================================

export type PaymentProviderType = 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'AGGREGATOR';

export type BookingAccessMode = 'MEMBERSHIP' | 'INDIVIDUAL_PURCHASE' | 'SESSION_CREDIT';

export type PaymentStatus = 
  | 'CREATED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface MemberSessionCredit {
  id: string;
  userId: string;
  amount: number;
  source: 'CANCELLATION_REFUND' | 'PURCHASE' | 'PROMOTIONAL' | 'ADMIN_GRANT';
  expiresAt?: string;
  createdAt: string;
}

export interface PaymentRequest {
  userId: string;
  customerName: string;
  customerPhone: string;
  amountXOF: number;
  purchaseType: 'SESSION_PASS' | 'MEMBERSHIP';
  purchaseReference: string; // sessionId or planId
  idempotencyKey: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResult {
  transactionId: string;
  provider: PaymentProviderType;
  providerReference?: string;
  checkoutUrl?: string; // Redirect URL for Wave or OM
  status: PaymentStatus;
  message: string;
}

export interface WebhookResult {
  verified: boolean;
  transactionId: string;
  providerReference: string;
  status: PaymentStatus;
  amountXOF: number;
  metadata?: Record<string, unknown>;
}

export interface TrainingSession {
  id: string;
  day: string;
  date: number; // day of month
  month: string; // 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  monthIndex: number; // 8 = Sept, 9 = Oct, 10 = Nov, 11 = Dec
  year: number; // 2026
  time: string;
  activity: string;
  studio: string;
  coach: string;
  color: string;
  capacity: number;
  bookedSeats: number;
  priceXOF: number;
  week: number;
  fullDateString?: string;
  isCancelled?: boolean;
  isCustomLimit?: boolean;
}
