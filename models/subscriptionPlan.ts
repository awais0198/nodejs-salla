import { Schema, model, Document } from 'mongoose'

import { BILLING_CYCLES, SUBSCRIPTION_PLAN_STATUSES } from '../constants'

interface ISubscriptionPlan extends Document {
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  status: 'active' | 'inactive'
  description?: string
  discount?: number
  createdAt: Date
  updatedAt: Date
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, enum: BILLING_CYCLES, required: true },
  status: { type: String, enum: SUBSCRIPTION_PLAN_STATUSES, required: true },
  description: { type: String },
  discount: { type: Number, min: 0, max: 100 },
}, {
  timestamps: true,
})

const SubscriptionPlan = model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema)

export { SubscriptionPlan, ISubscriptionPlan }
