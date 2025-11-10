import { Currency } from "../services/db";

export const toMinor = (amount: number, currency: Currency): number =>
  currency === Currency.VND ? amount : Math.round(amount * 100);

export const formatMoney = (minor: number, currency: Currency) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(currency === Currency.VND ? minor : minor / 100);

export const formatNumberWithCommas = (value: string | number): string => {
  const numStr = value.toString();
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join('.');
};

export const removeCommas = (value: string): string => {
  return value.replace(/\./g, '');
};

export const isValidNumberInput = (value: string): boolean => {
  // Allow empty string, digits, commas, and one decimal point
  return /^[\d.]*\.?\d*$/.test(value);
};
