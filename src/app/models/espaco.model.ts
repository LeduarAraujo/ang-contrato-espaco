export interface Espaco {
  id?: number;
  nome: string;
  logoUrl?: string;
  logoData?: string; // Base64 da imagem
  logoMimeType?: string; // Tipo MIME da imagem
  nomeProprietario?: string;
  cnpjProprietario?: string;
  createdAt?: string;
  updatedAt?: string;
}
