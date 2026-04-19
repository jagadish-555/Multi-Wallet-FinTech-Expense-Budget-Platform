import { appEvents, ExpenseAddedPayload } from './eventEmitter';
import { budgetService } from '../services/budget.service';
import { notificationRepository } from '../repositories/notification.repository';
import { BUDGET_ALERT_THRESHOLDS } from '../config/constants';

export function registerBudgetAlertListener(): void {
  appEvents.on('expense.added', async (payload: ExpenseAddedPayload) => {
    try {
      const budgetsWithUsage = await budgetService.getAllWithUsage(payload.userId);

      for (const budget of budgetsWithUsage) {
        const isRelevant =
          budget.categoryId === null ||
          budget.categoryId === payload.categoryId;

        if (!isRelevant) continue;

        const [warningThreshold, exceededThreshold] = BUDGET_ALERT_THRESHOLDS;

        if (budget.percentUsed >= exceededThreshold) {
          const alreadySent = await notificationRepository.existsForBudgetAndType(
            payload.userId,
            budget.id,
            'BUDGET_EXCEEDED'
          );

          if (!alreadySent) {
            await notificationRepository.create({
              userId:   payload.userId,
              type:     'BUDGET_EXCEEDED',
              message:  `Budget exceeded! You've spent ${budget.percentUsed}% of your${budget.categoryId ? ` ${budget.category?.name}` : ''} budget.`,
              budgetId: budget.id,
            });
          }
        } else if (budget.percentUsed >= warningThreshold) {
          const alreadySent = await notificationRepository.existsForBudgetAndType(
            payload.userId,
            budget.id,
            'BUDGET_WARNING'
          );

          if (!alreadySent) {
            await notificationRepository.create({
              userId:   payload.userId,
              type:     'BUDGET_WARNING',
              message:  `Heads up! You've used ${budget.percentUsed}% of your${budget.categoryId ? ` ${budget.category?.name}` : ''} budget.`,
              budgetId: budget.id,
            });
          }
        }
      }
    } catch (error) {
      console.error('[BudgetAlertListener] Failed to process expense.added event:', error);
    }
  });
}
