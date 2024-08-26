import { ISubscriptionPlan } from "../models/subscriptionPlan"

export function calculateProratedAmount(
  previousPlan: ISubscriptionPlan,
  newPlan: ISubscriptionPlan,
  subscriptionStartDate: Date
): number {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysRemaining = daysInMonth - now.getDate()
  const daysInPlan = daysInMonth

  const dailyRatePrevious = previousPlan.price / daysInPlan
  const dailyRateNew = newPlan.price / daysInPlan

  const proratedAmount = (dailyRateNew * daysRemaining) - (dailyRatePrevious * (daysInMonth - daysRemaining))

  return proratedAmount
}
