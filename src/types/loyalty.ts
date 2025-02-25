
export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  isAvailable: boolean;
}

export interface LoyaltyProgramUser {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  availableRewards: LoyaltyReward[];
}

export interface CustomerFeedbackData {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}
