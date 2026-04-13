export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

// O contrato universal de pagamento para M-Pesa, e-Mola e futuros provedores
export interface IPaymentProvider {
  /**
   * Inicia o pagamento C2B Push
   * @param phone Número de celular do cliente
   * @param amount Valor a cobrar
   */
  initiatePayment(phone: string, amount: number): Promise<PaymentResponse>;

  /**
   * Verifica o status de uma transação pendente
   * @param transactionId ID único da transação retornado no initiatePayment
   */
  checkTransactionStatus(transactionId: string): Promise<boolean>;
}
