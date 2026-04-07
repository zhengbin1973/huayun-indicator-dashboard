import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function calculateCompletionRate(actual: number, target: number): number {
  if (target === 0) return 0
  return Math.min(actual / target, 1.5)
}

export function getStatusColor(rate: number): string {
  if (rate >= 1) return 'text-emerald-600'
  if (rate >= 0.8) return 'text-amber-600'
  return 'text-red-600'
}

export function getStatusBadge(rate: number): string {
  if (rate >= 1) return 'badge-success'
  if (rate >= 0.8) return 'badge-warning'
  return 'badge-danger'
}
