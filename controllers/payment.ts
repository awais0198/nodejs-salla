import { Request, Response } from 'express'
import { addMonths } from 'date-fns'

import { Payment } from '../models/payment'
import { Invoice } from '../models/invoice'
import { Customer } from '../models/customer'

export class PaymentController {
  static async processPayment(req: Request, res: Response) {
    try {
      const { invoiceId, paymentMethod, amount, currency } = req.body

      if (!invoiceId || !paymentMethod || !amount) {
        return res.status(400).json({ message: 'Missing required fields: invoiceId, paymentMethod, or amount' })
      }

      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount: Must be a positive number' })
      }

      const payment = new Payment({ invoiceId, paymentMethod, amount, currency })
      await payment.save()

      const invoice = await Invoice.findById(invoiceId)

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' })
      }

      if (invoice.status === 'paid') {
        return res.status(400).json({ message: 'Invoice already paid' })
      }

      const customer = await Customer.findById(invoice?.customerId)
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      invoice.status = 'paid'
      invoice.paymentDate = new Date()
      await invoice.save()

      payment.status = 'completed'
      await payment.save()

      customer.lastPaymentDate = new Date()
      customer.nextBillingDate = addMonths(customer.lastPaymentDate, 1)
      await customer.save()

      res.status(201).json(payment)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }
}
