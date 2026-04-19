import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}

export const appEvents = new AppEventEmitter();

export interface ExpenseAddedPayload {
  userId: string;
  expenseId: string;
  amount: number;
  categoryId: string;
  currency: string;
}
