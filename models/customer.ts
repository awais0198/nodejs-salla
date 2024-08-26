import { Schema, model, Document } from 'mongoose'

interface ICustomer extends Document {
  name: string
  subscriptionPlanId: Schema.Types.ObjectId
  subscriptionStatus: 'active' | 'cancelled'
  email: string
  phoneNumber?: string
  address?: string
  subscriptionStartDate?: Date
  nextBillingDate?: Date
  lastPaymentDate?: Date
  proratedAmount?: number
  createdAt?: Date
  updatedAt?: Date
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  subscriptionPlanId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  subscriptionStatus: { type: String, enum: ['active', 'cancelled'], required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  address: { type: String, required: false },
  subscriptionStartDate: { type: Date, required: false },
  nextBillingDate: { type: Date, required: false, default: null },
  lastPaymentDate: { type: Date, required: false },
  proratedAmount: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

export const Customer = model<ICustomer>('Customer', CustomerSchema)
