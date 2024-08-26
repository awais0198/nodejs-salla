import { Handler } from 'aws-lambda'

import { connectDB } from '../config/db'
import { InvoiceService } from '../services/invoiceService'

connectDB()

export const generateInvoice: Handler = async (event: any) => {
  try {
    const { customerId } = JSON.parse(event.body)

    const invoice = await InvoiceService.generateInvoice(customerId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Invoice generated successfully',
        invoice,
      }),
    }
  } catch (error) {
    console.error('Error generating invoice:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error generating invoice',
        error: error.message,
      }),
    }
  }
}
