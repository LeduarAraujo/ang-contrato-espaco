/**
 * Configuração centralizada de endpoints da API
 * Facilita a manutenção e alteração de URLs
 */
export const API_CONFIG = {
  // Base URL da API
  BASE_URL: 'https://atom-contrato-espaco-b50858f32cd7.herokuapp.com/api',

  // Endpoints para Espaços
  ESPACOS: {
    LISTAR: '/espacos',
    BUSCAR: '/espacos/:id',
    CRIAR: '/espacos',
    ATUALIZAR: '/espacos/:id',
    EXCLUIR: '/espacos/:id',
    BUSCAR_POR_NOME: '/espacos/buscar'
  },

  // Endpoints para Tipos de Contrato
  TIPOS_CONTRATO: {
    LISTAR: '/tipos-contrato',
    BUSCAR: '/tipos-contrato/:id',
    CRIAR: '/tipos-contrato',
    ATUALIZAR: '/tipos-contrato/:id',
    EXCLUIR: '/tipos-contrato/:id',
    BUSCAR_POR_ESPACO: '/tipos-contrato/espaco/:espacoId',
    BUSCAR_POR_TIPO: '/tipos-contrato/tipo/:tipo'
  },

  // Endpoints para Reservas
  RESERVAS: {
    LISTAR: '/reservas',
    BUSCAR: '/reservas/:id',
    CRIAR: '/reservas',
    ATUALIZAR: '/reservas/:id',
    EXCLUIR: '/reservas/:id',
    BUSCAR_POR_ESPACO: '/reservas/espaco/:espacoId',
    BUSCAR_POR_PERIODO: '/reservas/periodo',
    BUSCAR_POR_CLIENTE: '/reservas/cliente',
    BUSCAR_POR_CPF: '/reservas/cpf'
  }
} as const;

/**
 * Função utilitária para construir URLs com parâmetros
 * @param endpoint - Endpoint base
 * @param params - Parâmetros para substituir
 * @returns URL construída
 */
export function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  let url = endpoint;

  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });

  return url;
}

/**
 * Função para obter URL completa com base URL
 * @param endpoint - Endpoint relativo
 * @param params - Parâmetros opcionais
 * @returns URL completa
 */
export function getFullUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = params ? buildUrl(endpoint, params) : endpoint;
  return `${API_CONFIG.BASE_URL}${url}`;
}
