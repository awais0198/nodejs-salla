import { Customer } from '../models/customer'
import { Invoice } from '../models/invoice'
import { sendEmail } from './emailService'
import { SubscriptionPlan } from '../models/subscriptionPlan'

export class InvoiceService {
  static async generateInvoice(customerId: string) {
    const customer = await Customer.findById(customerId).populate('subscriptionPlanId')
    if (!customer) throw new Error('Customer not found')

    const plan = await SubscriptionPlan.findById(customer.subscriptionPlanId)
    if (!plan) throw new Error('Subscription plan not found')

    const invoiceAmount = plan.price

    const invoice = new Invoice({
      customerId,
      amount: invoiceAmount,
      status: 'generated',
    })
    await invoice.save()

    await sendEmail({
      to: customer.email,
      subject: 'Invoice Generated',
      body: `Your invoice has been generated for your subscription plan "${plan.name}". Total amount is ${invoiceAmount}.`
    })

    return invoice
  }
}
