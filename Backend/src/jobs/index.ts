import { startRecurringExpenseJob } from './recurringExpense.job';

export function startAllJobs(): void {
  startRecurringExpenseJob();
}
