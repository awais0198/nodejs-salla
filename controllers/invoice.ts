import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { Invoice } from '../models/invoice'
import { InvoiceService } from '../services/invoiceService'
import { Customer } from '../models/customer'

export class InvoiceController {
  static async generateInvoice(req: Request, res: Response) {
    try {
      const { customerId } = req.body

      if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' })
      }

      const customer = await Customer.findById(customerId)

      if (!customer) {
        return res.status(404).json({ message: 'This Customer is not found' })
      }

      const invoice = await InvoiceService.generateInvoice(customerId)

      if (!invoice) {
        return res.status(500).json({ message: 'Failed to generate this invoice' })
      }

      res.status(201).json(invoice)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }

  static async listInvoices(req: Request, res: Response) {
    try {
      const { customerId } = req.params
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({ message: 'Invalid format of customer ID' })
      }

      const invoices = await Invoice.find({ customerId })

      if (invoices.length === 0) {
        return res.status(404).json({ message: 'No invoices found for this customer' })
      }

      res.status(200).json(invoices)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }
}
