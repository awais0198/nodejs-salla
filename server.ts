import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import express from 'express'

import { connectDB } from "./config/db"
import { errorHandler } from './middlewares/errorHandler'
import routes from './routes'
import billingCronJob from './cron/billingCron'
import retryFailedPaymentsJob from './cron/retryFailedPaymentsJob'

const app = express()
const PORT = process.env.PORT || 8000

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(errorHandler)

app.use('/api/v1', routes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

billingCronJob.start()
retryFailedPaymentsJob.start()
