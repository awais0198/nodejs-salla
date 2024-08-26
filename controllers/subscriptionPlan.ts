import { Request, Response } from 'express'

import { BILLING_CYCLES, SUBSCRIPTION_PLAN_STATUSES } from '../constants'
import { SubscriptionPlan } from '../models/subscriptionPlan'

export class SubscriptionPlanController {
  static async createSubscriptionPlan(req: Request, res: Response) {
    try {
      const { name, price, billingCycle, status, description, discount } = req.body;

      if (!name || !price || !billingCycle || !status) {
        return res.status(400).json({ message: 'Missing required fields: name, price, billingCycle, and status are required.' });
      }

      if (typeof name !== 'string' || typeof price !== 'number' || typeof billingCycle !== 'string' || typeof status !== 'string') {
        return res.status(400).json({ message: 'Invalid data types provided' });
      }

      if (!BILLING_CYCLES.includes(billingCycle)) {
        return res.status(400).json({ message: `Invalid billingCycle. Must be from these ${BILLING_CYCLES}.` });
      }

      if (!SUBSCRIPTION_PLAN_STATUSES.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be from these ${SUBSCRIPTION_PLAN_STATUSES}.` });
      }

      if (description && typeof description !== 'string') {
        return res.status(400).json({ message: 'Invalid description type. Must be a string.' });
      }

      if (discount && typeof discount !== 'number') {
        return res.status(400).json({ message: 'Invalid discount type. Must be a number.' });
      }

      const existingPlan = await SubscriptionPlan.findOne({ name });
      if (existingPlan) {
        return res.status(409).json({ message: 'A subscription plan with this name already exists.' });
      }

      const plan = new SubscriptionPlan({
        name,
        price,
        billingCycle,
        status,
        description,
        discount
      });

      await plan.save();
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }

  static async getSubscriptionPlans(req: Request, res: Response) {
    try {
      const plans = await SubscriptionPlan.find()

      if (plans.length === 0) {
        return res.status(404).json({ message: 'No plans found' });
      }

      res.status(200).json(plans)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || 'An unexpected error occurred' })
    }
  }
}
