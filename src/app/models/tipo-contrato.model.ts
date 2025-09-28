export interface TipoContrato {
  id?: number;
  espacoId: number;
  espacoNome?: string;
  tipo: 'CONTRATO' | 'RECIBO';
  titulo: string;
  textoTemplate: string;
  createdAt?: string;
  updatedAt?: string;
}
