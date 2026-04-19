import cron from 'node-cron';
import prisma from '../config/database';
import { recurringRepository } from '../repositories/recurring.repository';
import { appEvents } from '../events/eventEmitter';
import { computeNextDueDate } from '../services/recurring.service';

export async function runRecurringExpenseJob(): Promise<void> {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const dueSchedules = await recurringRepository.findDueSchedules(today);

  if (dueSchedules.length === 0) return;

  console.log(`[RecurringJob] Processing ${dueSchedules.length} due schedule(s)`);

  for (const schedule of dueSchedules) {
    try {
      const expense = await prisma.expense.create({
        data: {
          userId:      schedule.userId,
          categoryId:  schedule.categoryId,
          amount:      schedule.amount,
          amountBase:  schedule.amount,
          currency:    schedule.currency,
          description: schedule.description,
          expenseDate: new Date(),
          tags:        schedule.tags as never,
          recurringId: schedule.id,
        },
      });

      const nextDueDate = computeNextDueDate(
        new Date(schedule.nextDueDate),
        schedule.scheduleType,
        schedule.scheduleDay
      );

      await recurringRepository.updateAfterTrigger(schedule.id, nextDueDate);

      appEvents.emit('expense.added', {
        userId:     schedule.userId,
        expenseId:  expense.id,
        amount:     Number(expense.amountBase),
        categoryId: expense.categoryId,
        currency:   expense.currency,
      });

      console.log(`[RecurringJob] Created expense for schedule ${schedule.id}, next due: ${nextDueDate.toISOString().split('T')[0]}`);
    } catch (error) {
      console.error(`[RecurringJob] Failed to process schedule ${schedule.id}:`, error);
    }
  }
}

export function startRecurringExpenseJob(): void {
  cron.schedule('0 0 * * *', async () => {
    console.log('[RecurringJob] Starting midnight run...');
    await runRecurringExpenseJob();
  }, {
    timezone: 'Asia/Kolkata',
  });

  console.log('[RecurringJob] Scheduled — runs daily at midnight IST');
}
