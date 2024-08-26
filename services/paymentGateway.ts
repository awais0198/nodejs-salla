export class PaymentGateway {
  static async processPayment({
    amount,
    currency,
    paymentMethod,
    invoiceId,
    customerId,
    transactionId
  }: {
    amount: number;
    currency: string;
    paymentMethod: string;
    invoiceId: string;
    customerId: string;
    transactionId: string;
  }) {
    // Implement logic for payment
  }
}
