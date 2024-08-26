import cron from 'node-cron'

import { connectDB } from '../config/db'
import { Customer } from '../models/customer'
import { InvoiceService } from '../services/invoiceService'

connectDB()

const billingCronJob = cron.schedule('0 0 * * *', async () => {
  console.log('Running daily billing job')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const customers = await Customer.find({ subscriptionStatus: 'active', nextBillingDate: today }).populate('subscriptionPlanId')

    for (const customer of customers) {
      try {
        const invoice = await InvoiceService.generateInvoice(customer._id as string)

        console.log(`Invoice generated for customer ${customer.name}: ${invoice._id}`)
      } catch (error) {
        console.error(`Failed to generate invoice for customer ${customer.name}:`, error)
      }
    }
  } catch (error) {
    console.error('Error in billing job:', error)
  }
})

export default billingCronJob
