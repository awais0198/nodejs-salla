import { Schema, model, Document } from 'mongoose'

import { INVOICE_STATUSES } from '../constants'

interface IInvoice extends Document {
  customerId: Schema.Types.ObjectId
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'generated'
  paymentDate?: Date
  dueDate?: Date
  description?: string
  paymentMethod?: string
  transactionId?: string
  currency?: string
  customerName?: string
  createdDate?: Date
  updatedDate?: Date
}

const InvoiceSchema = new Schema<IInvoice>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: INVOICE_STATUSES, required: true },
  paymentDate: { type: Date },
  dueDate: { type: Date },
  description: { type: String },
  paymentMethod: { type: String },
  transactionId: { type: String },
  currency: { type: String, default: 'USD' },
  customerName: { type: String },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
})

const Invoice = model<IInvoice>('Invoice', InvoiceSchema)

export { Invoice, IInvoice }