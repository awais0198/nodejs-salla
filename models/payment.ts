import { Schema, model, Document } from 'mongoose'

import { PAYMENT_STATUSES } from '../constants'

interface IPayment extends Document {
  invoiceId: Schema.Types.ObjectId
  amount: number
  paymentMethod: string
  paymentDate: Date
  transactionId?: string
  currency: string
  status: 'pending' | 'completed' | 'failed'
  customerId?: Schema.Types.ObjectId
  retryCount: number
  customerEmail: string
}

const PaymentSchema = new Schema<IPayment>({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  transactionId: { type: String, required: false },
  currency: { type: String, required: true, default: 'USD' },
  status: { type: String, enum: PAYMENT_STATUSES, default: 'pending' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
  retryCount: { type: Number, default: 0 },
  customerEmail: { type: String, required: true },
})

export const Payment = model<IPayment>('Payment', PaymentSchema)
