import { Currency } from "../services/db";

export const toMinor = (amount: number, currency: Currency): number =>
  currency === Currency.VND ? amount : Math.round(amount * 100);

export const formatMoney = (minor: number, currency: Currency) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(currency === Currency.VND ? minor : minor / 100);
