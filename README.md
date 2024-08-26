# Node.js SaaS Billing App

## Overview

This project is a SaaS billing application built with Node.js, TypeScript, and MongoDB. It supports multiple subscription tiers, handles recurring billing, processes payments, and manages invoices. It also includes email notifications for various billing events.

## Features

- **Subscription Management**: Create and manage subscription plans with different pricing and billing cycles.
- **Billing Engine**: Automatically generate invoices and handle prorated billing for mid-cycle upgrades or downgrades.
- **Payment Processing**: Record payments, handle failed payments, and implement retry logic.
- **Notifications**: Send email notifications when invoices are generated, payments are successful, or payments fail.

## Technologies

- **Node.js**: Runtime for executing JavaScript code on the server.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
- **Nodemailer**: Module for email sending.
- **Stripe**: Payment processing service.
- **Node-cron**: Cron jobs for scheduling tasks.
- **AWS Lambda**: For serverless function execution (optional, if used).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/awais098/nodejs-salla.git
   cd nodejs-salla
### Install Dependencies

bash
Copy code
npm install
Setup Environment Variables

Create a .env file in the root directory with the following example variables:

### env

    MONGO_URI=mongodb://localhost:27017/yourdbname
    EMAIL_SERVICE=your-email-service
    EMAIL_USER=your-email-user
    EMAIL_PASS=your-email-pass
    STRIPE_SECRET_KEY=your-stripe-secret-key
### Run the Application

For development:

    npm run dev


For production:

    npm start
## API Endpoints

### Customer Routes

- **Create Customer**
  - **Endpoint**: `POST /customers`
  - **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subscriptionPlanId": "plan_id"
    }
    ```
  - **Description**: Creates a new customer.

- **Get Customers**
  - **Endpoint**: `GET /customers`
  - **Description**: Retrieves a list of all customers.

- **Change Subscription Plan**
  - **Endpoint**: `POST /customers/change-subscription`
  - **Request Body**:
    ```json
    {
      "customerId": "customer_id",
      "newSubscriptionPlanId": "new_plan_id"
    }
    ```
  - **Description**: Changes the subscription plan for a customer.

### Subscription Plan Routes

- **Create Subscription Plan**
  - **Endpoint**: `POST /subscription-plans`
  - **Request Body**:
    ```json
    {
      "name": "Pro Plan",
      "price": 29.99,
      "status": "active",
      "billingCycle": "monthly",
      "description": "Pro plan with additional features"
    }
    ```
  - **Description**: Creates a new subscription plan.

- **Get Subscription Plans**
  - **Endpoint**: `GET /subscription-plans`
  - **Description**: Retrieves a list of all subscription plans.

### Invoice Routes

- **Generate Invoice**
  - **Endpoint**: `POST /invoices/generate`
  - **Request Body**:
    ```json
    {
      "customerId": "customer_id"
    }
    ```
  - **Description**: Generates an invoice for a customer based on their current subscription plan.

- **List Invoices**
  - **Endpoint**: `GET /invoices/:customerId`
  - **Description**: Retrieves a list of invoices for a given customer.

### Payment Routes

- **Process Payment**
  - **Endpoint**: `POST /payments`
  - **Request Body**:
    ```json
    {
      "invoiceId": "invoice_id",
      "amount": 29.99,
      "paymentMethod": "credit_card"
    }
    ```
  - **Description**: Processes a payment for a given invoice.


Contact
Author: awais0198
Email: ahmadawais00786@gmail.com
