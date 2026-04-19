import { registerBudgetAlertListener } from './budgetAlert.listener';

export function registerAllListeners(): void {
  registerBudgetAlertListener();
}
