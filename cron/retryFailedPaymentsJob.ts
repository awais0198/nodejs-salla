import cron from 'node-cron'

import { Payment } from '../models/payment'
import { PaymentService } from '../services/paymentService'
import { MAX_RETRY_ATTEMPTS } from '../constants'

const retryFailedPaymentsJob = cron.schedule('0 0 * * *', async () => {
  try {
    const failedPayments = await Payment.find({ status: 'failed' })

    for (const payment of failedPayments) {
      try {
        if (payment.retryCount < MAX_RETRY_ATTEMPTS) {
          const success = await PaymentService.retryPayment(payment)

          if (success) {
            payment.status = 'completed'
          } else {
            payment.retryCount += 1
            payment.status = 'failed'
          }

          await payment.save()
        } else {
          console.log(`Payment ${payment._id} reached max retry attempts`)
        }
      } catch (error) {
        console.error(`Failed to retry payment ${payment._id}:`, error)
      }
    }
  } catch (error) {
    console.error('Error in retryFailedPaymentsJob:', error)
  }
})

export default retryFailedPaymentsJob
