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

export const DEFAULT_NOTIFICATION_CONFIG = {
  colors: {
    promotion: '#796CE7',
    commande: '#FA8C00',
    probleme: '#DF4848',
    order: '#109F81',
    low_balance: '#FA8C00',
    debt_settled: '#109F81',
    partial_debt_settled: '#FA8C00',
    payment_confirmation: '#109F81',
    negative_balance: '#DF4848',
  },
  types: [
    'promotion',
    'commande',
    'probleme',
    'order',
    'low_balance',
    'debt_settled',
    'partial_debt_settled',
    'payment_confirmation',
    'negative_balance',
  ],
};
