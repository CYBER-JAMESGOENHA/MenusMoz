import { IPaymentProvider } from './providers/IPaymentProvider';

/**
 * PaymentManager atua como o Orquestrador usando o padrão Strategy/Adapter.
 * Ele não precisa saber se está a usar M-Pesa ou e-Mola, ele delega ao provider.
 */
export class PaymentManager {
  private provider: IPaymentProvider;

  // Injeção da dependência (M-Pesa, e-Mola, etc)
  constructor(provider: IPaymentProvider) {
    this.provider = provider;
  }

  async processCheckout(phone: string, amount: number) {
    // 1. Validações iniciais (telefone é moçambicano, montante > 0)
    if (!phone || amount <= 0) {
      throw new Error('Dados de pagamento inválidos. Verifique o número e o valor.');
    }

    try {
      // 2. Transfere a complexidade para o provider injetado
      console.log(`Iniciando checkout de ${amount}MTn para ${phone}...`);
      const response = await this.provider.initiatePayment(phone, amount);
      
      return response;
    } catch (error) {
      // Aqui integrariamos lógica de logging ou Sentry no futuro
      console.error('Erro no checkout:', error);
      throw error;
    }
  }
}
