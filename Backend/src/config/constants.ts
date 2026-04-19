export const SALT_ROUNDS = 12;

export const SYSTEM_CATEGORIES = [
  { name: 'Food & Dining', icon: 'utensils', colorHex: '#f97316' },
  { name: 'Transport', icon: 'car', colorHex: '#3b82f6' },
  { name: 'Shopping', icon: 'shopping-bag', colorHex: '#a855f7' },
  { name: 'Bills & Utilities', icon: 'zap', colorHex: '#eab308' },
  { name: 'Health', icon: 'heart', colorHex: '#ef4444' },
  { name: 'Entertainment', icon: 'tv', colorHex: '#06b6d4' },
  { name: 'Education', icon: 'book', colorHex: '#10b981' },
  { name: 'Other', icon: 'tag', colorHex: '#6b7280' },
] as const;

export const BUDGET_ALERT_THRESHOLDS = [80, 100] as const;

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_MAX_LIMIT = 100;
