# Sistema de Geração de Contratos em PDF

Este projeto implementa um sistema completo para geração de relatórios em PDF com dois tipos de contratos:

## 📋 Tipos de Contratos

### 1. Contrato de Locação
- Dados completos do cliente (nome, CPF, endereço, telefone)
- Informações do espaço (nome, descrição, capacidade)
- Período de locação (data início e fim)
- Valores (total e entrada)
- Texto personalizado
- Cláusulas padrão do contrato

### 2. Recibo de Pagamento
- Dados do cliente
- Informações do pagamento (valor, data, forma de pagamento)
- Descrição do serviço
- Texto personalizado
- Observações

## 🚀 Funcionalidades

- ✅ **Geração de PDF**: Criação automática de PDFs formatados
- ✅ **Texto Personalizado**: Possibilidade de adicionar texto customizado aos documentos
- ✅ **Endpoints Centralizados**: Configuração centralizada de todas as URLs da API
- ✅ **Validação de Formulários**: Validação completa dos dados obrigatórios
- ✅ **Interface Responsiva**: Design moderno e responsivo
- ✅ **Estados de Loading**: Feedback visual durante a geração do PDF
- ✅ **Tratamento de Erros**: Mensagens de erro claras e informativas

## 🛠️ Estrutura do Projeto

```
src/app/
├── config/
│   └── api.config.ts          # Configuração centralizada de endpoints
├── models/
│   └── contrato.model.ts      # Interfaces TypeScript para os dados
├── services/
│   ├── pdf.service.ts         # Serviço para geração de PDFs
│   ├── contrato.service.ts    # Serviço para requisições HTTP
│   └── espacos.service.ts     # Serviço existente para espaços
└── feature/
    └── contrato/
        ├── contrato.ts        # Componente principal
        ├── contrato.html      # Template do formulário
        └── contrato.scss      # Estilos CSS
```

## 📡 Endpoints da API

### Contratos de Locação
- `GET /api/contratos/locacao` - Listar contratos
- `GET /api/contratos/locacao/:id` - Buscar contrato por ID
- `POST /api/contratos/locacao` - Criar novo contrato
- `PUT /api/contratos/locacao/:id` - Atualizar contrato
- `DELETE /api/contratos/locacao/:id` - Excluir contrato
- `GET /api/contratos/locacao/:id/pdf` - Gerar PDF do contrato

### Recibos de Pagamento
- `GET /api/recibos` - Listar recibos
- `GET /api/recibos/:id` - Buscar recibo por ID
- `POST /api/recibos` - Criar novo recibo
- `PUT /api/recibos/:id` - Atualizar recibo
- `DELETE /api/recibos/:id` - Excluir recibo
- `GET /api/recibos/:id/pdf` - Gerar PDF do recibo

### Outros Endpoints
- `GET /api/espacos` - Gerenciar espaços
- `GET /api/clientes` - Gerenciar clientes
- `GET /api/relatorios/*` - Relatórios diversos

## 🎨 Como Usar

### 1. Acessar a Página de Contratos
Navegue até a rota `/contrato` no aplicativo.

### 2. Selecionar Tipo de Contrato
Use os botões no topo para alternar entre:
- **Contrato de Locação**
- **Recibo de Pagamento**

### 3. Preencher os Dados
- Campos marcados com `*` são obrigatórios
- Use o campo "Texto Personalizado" para adicionar conteúdo customizado
- Adicione observações se necessário

### 4. Gerar PDF
Clique no botão "Gerar PDF" para criar e baixar o documento.

## 🔧 Configuração

### Alterar URL da API
Edite o arquivo `src/app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Altere aqui
  // ... resto da configuração
};
```

### Personalizar PDF
O serviço `PdfService` permite personalizar:
- Título e subtítulo
- Margens
- Logo (futuro)
- Rodapé (futuro)

## 📦 Dependências

- `jspdf`: Geração de PDFs
- `jspdf-autotable`: Tabelas no PDF (instalado)
- `@angular/common/http`: Requisições HTTP
- `@angular/forms`: Formulários reativos

## 🚀 Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build
```

## 📝 Exemplo de Uso

```typescript
// No componente
constructor(
  private pdfService: PdfService,
  private contratoService: ContratoService
) {}

// Gerar PDF localmente
gerarPDF() {
  const contrato = { /* dados do contrato */ };
  this.pdfService.gerarContratoLocacao(contrato, 'Texto personalizado');
}

// Salvar no servidor e gerar PDF
salvarEContrato() {
  this.contratoService.criarContratoLocacao(contrato)
    .subscribe(response => {
      // PDF gerado automaticamente pelo servidor
    });
}
```

## 🔮 Próximas Funcionalidades

- [ ] Upload de logo personalizada
- [ ] Templates de contrato editáveis
- [ ] Assinatura digital
- [ ] Envio por email
- [ ] Histórico de contratos
- [ ] Relatórios consolidados
- [ ] Backup automático

## 🐛 Solução de Problemas

### PDF não gera
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se o navegador permite downloads
- Verifique o console para erros JavaScript

### Erro de conexão com API
- Verifique se a URL da API está correta em `api.config.ts`
- Confirme se o servidor está rodando
- Verifique as configurações de CORS

### Formulário não valida
- Certifique-se de que todos os campos obrigatórios estão preenchidos
- Verifique se as datas estão no formato correto
- Confirme se os valores numéricos são válidos

