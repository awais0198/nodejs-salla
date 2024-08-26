import { Payment } from '../models/payment'
import { Invoice } from '../models/invoice'
import { PaymentGateway } from './paymentGateway'
import { sendEmail } from './emailService'

export class PaymentService {
  static async processPayment(invoiceId: string, amount: number, paymentMethod: string) {
    const payment = await this.createPayment(invoiceId, amount, paymentMethod)
    await this.updateInvoiceStatus(invoiceId, 'paid')

    await sendEmail({
      to: payment.customerEmail,
      subject: 'Payment Successful',
      body: `Your payment of ${amount} has been processed successfully.`
    })

    return payment
  }

  static async retryPayment(payment: any): Promise<boolean> {
    try {
      const invoice = await Invoice.findById(payment.invoiceId)
      if (!invoice) {
        console.error(`Invoice not found for payment ${payment._id}`)
        return false
      }

      const paymentResult = await PaymentGateway.processPayment({
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        invoiceId: payment.invoiceId,
        customerId: payment.customerId,
        transactionId: payment.transactionId
      })

      if (paymentResult?.success) {
        await this.updatePaymentStatus(payment, 'completed', paymentResult.transactionId)
        await this.updateInvoiceStatus(payment.invoiceId, 'paid')

        await sendEmail({
          to: payment.customerEmail,
          subject: 'Payment Retry Successful',
          body: `Your payment of ${payment.amount} has been successfully processed after retry.`
        })

        return true
      } else {
        await this.updatePaymentStatus(payment, 'failed')

        await sendEmail({
          to: payment.customerEmail,
          subject: 'Payment Retry Failed',
          body: `Your payment of ${payment.amount} failed after retry. Please contact support.`
        })

        return false
      }
    } catch (error) {
      console.error(`Error processing payment retry for payment ${payment._id}:`, error)

      await sendEmail({
        to: payment.customerEmail,
        subject: 'Payment Retry Error',
        body: `An error occurred while processing your payment retry. Please contact support.`
      })

      return false
    }
  }

  private static async createPayment(invoiceId: string, amount: number, paymentMethod: string) {
    const invoice = await Invoice.findById(invoiceId).populate('customerId')
    if (!invoice) throw new Error('Invoice not found')

    const customer = invoice.customerId
    if (!customer) throw new Error('Customer not found')

    const payment = new Payment({
      invoiceId,
      amount,
      paymentMethod,
      customerEmail: customer.email
    })

    await payment.save()
    return payment
  }

  private static async updatePaymentStatus(payment: any, status: string, transactionId?: string) {
    payment.status = status
    payment.paymentDate = new Date()
    if (transactionId) {
      payment.transactionId = transactionId
    }
    await payment.save()
  }

  private static async updateInvoiceStatus(invoiceId: string, status: string) {
    const invoice = await Invoice.findById(invoiceId)
    if (invoice) {
      invoice.status = status as 'pending' | 'failed' | 'paid' | 'generated'
      invoice.paymentDate = new Date()
      await invoice.save()
    }
    return invoice
  }
}
