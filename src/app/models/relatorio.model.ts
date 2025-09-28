export interface Relatorio {
  id?: number;
  tipoContratoId: number;
  nomeCliente: string;
  cpfCliente: string;
  dataFesta: string;
  horaInicio: string;
  horaFim: string;
  valorPago: number;
  valorIntegral: boolean;
  arquivoGerado?: string;
  createdAt?: string;
  updatedAt?: string;
}
