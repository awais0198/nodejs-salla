import { Router } from 'express';
import { CustomerController } from './controllers/customer';
import { SubscriptionPlanController } from './controllers/subscriptionPlan';
import { InvoiceController } from './controllers/invoice';
import { PaymentController } from './controllers/payment';

const router = Router();

router.post('/customers', CustomerController.createCustomer);
router.get('/customers', CustomerController.getCustomers);
router.post('/customers/change-subscription', CustomerController.changeSubscriptionPlan);


router.post('/subscription-plans', SubscriptionPlanController.createSubscriptionPlan);
router.get('/subscription-plans', SubscriptionPlanController.getSubscriptionPlans);

router.post('/invoices/generate', InvoiceController.generateInvoice);
router.get('/invoices/:customerId', InvoiceController.listInvoices);

router.post('/payments', PaymentController.processPayment);

export default router;
