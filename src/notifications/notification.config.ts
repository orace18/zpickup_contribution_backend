import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export const notificationConfig = registerAs('notification', () => ({
  colors: {
    promotion: process.env.NOTIFICATION_COLOR_PROMOTION,
    commande: process.env.NOTIFICATION_COLOR_COMMANDE,
    probleme: process.env.NOTIFICATION_COLOR_PROBLEME,
    order: process.env.NOTIFICATION_COLOR_ORDER,
    low_balance: process.env.NOTIFICATION_COLOR_LOW_BALANCE,
    debt_settled: process.env.NOTIFICATION_COLOR_DEBT_SETTLED,
    partial_debt_settled: process.env.NOTIFICATION_COLOR_PARTIAL_DEBT_SETTLED,
    payment_confirmation: process.env.NOTIFICATION_COLOR_PAYMENT_CONFIRMATION,
    negative_balance: process.env.NOTIFICATION_COLOR_NEGATIVE_BALANCE,
  },
  types: process.env.NOTIFICATION_TYPES.split(','),
}));
