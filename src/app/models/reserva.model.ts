export interface Reserva {
  id?: number;
  espacoId: number;
  nomeCliente: string;
  cpfCliente: string;
  telefoneCliente: string;
  dataFesta: string; // Formato: YYYY-MM-DD para compatibilidade com LocalDate
  horaInicio: string; // Formato: HH:mm para compatibilidade com LocalTime
  horaFim: string; // Formato: HH:mm para compatibilidade com LocalTime
  valorPagamento: number;
  valorIntegral: boolean;
  valorRestante?: number;
  createdAt?: string;
  updatedAt?: string;
}
