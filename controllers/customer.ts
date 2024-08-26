import { Request, Response } from 'express'

import { Customer } from '../models/customer'
import { SubscriptionPlan } from '../models/subscriptionPlan'
import { VALID_SUBSCRIPTION_STATUSES } from '../constants'

export class CustomerController {
  static async createCustomer(req: Request, res: Response) {
    try {
      const { name, subscriptionPlanId, subscriptionStatus, email } = req.body

      if (!name || !subscriptionPlanId || !subscriptionStatus || !email) {
        return res.status(400).json({ message: 'These fields are required: name, subscriptionPlanId, subscriptionStatus, email' })
      }

      if (typeof name !== 'string' || typeof email !== 'string' || typeof subscriptionStatus !== 'string') {
        return res.status(400).json({ message: 'Invalid data types' })
      }

      if (!VALID_SUBSCRIPTION_STATUSES.includes(subscriptionStatus)) {
        return res.status(400).json({ message: 'Invalid subscriptionStatus. Must be "active" or "cancelled".' })
      }

      const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId)

      if (!subscriptionPlan) {
        return res.status(404).json({ message: 'Subscription plan not found' })
      }

      if (subscriptionPlan.status !== 'active') {
        return res.status(400).json({ message: 'Subscription plan is not active' })
      }

      const customer = new Customer(req.body)
      await customer.save()

      res.status(201).json(customer)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }

  static async changeSubscriptionPlan(req: Request, res: Response) {
    try {
      const { customerId, subscriptionPlanId } = req.body

      if (!customerId || !subscriptionPlanId) {
        return res.status(400).json({ message: 'customerId and subscriptionPlanId are required' })
      }

      const customer = await Customer.findById(customerId)
      const newPlan = await SubscriptionPlan.findById(subscriptionPlanId)

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      if (!newPlan) {
        return res.status(404).json({ message: 'Subscription plan not found' })
      }

      if (newPlan.status !== 'active') {
        return res.status(400).json({ message: 'Subscription plan is not active' })
      }

      const oldPlan = await SubscriptionPlan.findById(customer.subscriptionPlanId)

      let proratedAmount = 0

      if (oldPlan && (oldPlan._id as string).toString() !== (newPlan._id as string).toString()) {
        const daysInCycle = 30
        const daysUsed = Math.ceil((Date.now() - customer.lastPaymentDate!.getTime()) / (1000 * 60 * 60 * 24))
        const dailyOldRate = oldPlan.price / daysInCycle
        const dailyNewRate = newPlan.price / daysInCycle

        if (newPlan.price > oldPlan.price) {
          proratedAmount = (dailyNewRate - dailyOldRate) * (daysInCycle - daysUsed)
        } else {
          proratedAmount = (dailyOldRate - dailyNewRate) * (daysInCycle - daysUsed)
        }

        customer.proratedAmount = proratedAmount
      }

      customer.subscriptionPlanId = newPlan._id
      customer.subscriptionStartDate = new Date()
      customer.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      await customer.save()

      res.status(200).json(customer)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }

  static async getCustomers(req: Request, res: Response) {
    try {
      const customers = await Customer.find()

      if (customers.length === 0) {
        return res.status(404).json({ message: 'No customers found' })
      }

      res.status(200).json(customers)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }
}
