import Dexie, { type Table } from 'dexie'

export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  VND: 'VND',
  JPY: 'JPY',
  CNY: 'CNY',
  INR: 'INR',
  AUD: 'AUD',
  CAD: 'CAD',
  CHF: 'CHF',
} as const

export type Currency = (typeof Currency)[keyof typeof Currency]

export type Member = {
  id: string
  name: string
  alias?: string
  groupId: string
}

export type Group = {
  id: string
  name: string
  currency: Currency
  createdAt: string
}

export type Expense = {
  id: string
  groupId: string
  title: string
  amount: number
  currency: Currency
  paidBy: string
  date: string
  note: string
  splitMode: 'equal' | 'weights' | 'exact'
  weights?: Record<string, number>
  exacts?: Record<string, number>
}

export class AppDB extends Dexie {
  members!: Table<Member, string>
  groups!: Table<Group, string>
  expenses!: Table<Expense, string>

  constructor() {
    super('splitBill')
    this.version(1).stores({
      members: 'id, name, alias, groupId, [groupId+name]',
      groups: 'id, name, currency, createdAt',
      expenses: 'id, groupId, date, paidBy',
    });
  }
}

export const db = new AppDB();
