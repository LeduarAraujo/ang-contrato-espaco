export interface TipoContrato {
  id?: number;
  espacoId: number;
  espacoNome?: string;
  tipo: 'CONTRATO' | 'RECIBO';
  titulo: string;
  descricao?: string;
  textoTemplate: string;
  createdAt?: string;
  updatedAt?: string;
}
