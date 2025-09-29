# AngContratoEspaco

Sistema completo de gerenciamento de contratos e reservas de espaços com geração de PDFs.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#️-estrutura-do-projeto)
- [Tipos de Contratos](#-tipos-de-contratos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Usar](#-como-usar)
- [Endpoints da API](#-endpoints-da-api)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Desenvolvimento](#-desenvolvimento)
- [Solução de Problemas](#-solução-de-problemas)
- [Próximas Funcionalidades](#-próximas-funcionalidades)

## 🎯 Visão Geral

O **AngContratoEspaco** é um sistema web desenvolvido em Angular para gerenciamento completo de espaços, reservas e geração de contratos em PDF. O sistema oferece uma interface moderna e responsiva para facilitar o controle de locações e eventos.

### Características Principais

- ✅ **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos
- ✅ **Geração de PDF**: Criação automática de contratos e recibos formatados
- ✅ **Validação Completa**: Validação robusta de formulários e dados
- ✅ **Configuração Centralizada**: Endpoints e configurações centralizadas
- ✅ **Arquitetura Modular**: Código organizado em módulos e serviços
- ✅ **Tratamento de Erros**: Mensagens claras e informativas

## 🚀 Funcionalidades

### Módulos Principais

- **🏠 Home**: Página inicial com visão geral do sistema
- **🏢 Cadastro de Espaços**: Gerenciamento completo de espaços disponíveis
- **📅 Cadastro de Reservas**: Sistema de reservas com validação de datas
- **📋 Cadastro de Tipos de Contrato**: Configuração de diferentes tipos de contratos
- **🎉 Consulta de Festas**: Visualização e consulta de eventos e festas
- **📄 Geração de PDF**: Criação de contratos e recibos em PDF
- **📊 Lista de Reservas**: Visualização e gerenciamento de todas as reservas

### Funcionalidades Técnicas

- **Geração de PDF**: Criação automática de PDFs formatados
- **Texto Personalizado**: Possibilidade de adicionar texto customizado aos documentos
- **Endpoints Centralizados**: Configuração centralizada de todas as URLs da API
- **Estados de Loading**: Feedback visual durante operações
- **Tratamento de Erros**: Mensagens de erro claras e informativas

## 🛠️ Estrutura do Projeto

```
ang-contrato-espaco/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── api.config.ts              # Configurações da API
│   │   ├── feature/                       # Módulos de funcionalidades
│   │   │   ├── cadastro-espaco/           # Cadastro de espaços
│   │   │   ├── cadastro-reserva/          # Cadastro de reservas
│   │   │   ├── cadastro-tipo-contrato/    # Cadastro de tipos de contrato
│   │   │   ├── consulta-festas/           # Consulta de festas
│   │   │   ├── gerar-pdf/                 # Geração de PDFs (contratos)
│   │   │   ├── home/                      # Página inicial
│   │   │   └── lista-reservas/            # Lista de reservas
│   │   ├── layout/                        # Componentes de layout
│   │   │   ├── default-layout/            # Layout padrão
│   │   │   ├── footer/                    # Rodapé
│   │   │   └── navbar/                    # Barra de navegação
│   │   ├── models/                        # Modelos de dados
│   │   │   ├── espaco.model.ts            # Modelo de espaço
│   │   │   ├── reserva.model.ts           # Modelo de reserva
│   │   │   └── tipo-contrato.model.ts     # Modelo de tipo de contrato
│   │   ├── services/                      # Serviços
│   │   │   ├── espaco-selecionado.service.ts
│   │   │   ├── espaco.service.ts          # Serviço para espaços
│   │   │   ├── file.service.ts            # Serviço para arquivos
│   │   │   ├── focus.service.ts           # Serviço para foco
│   │   │   ├── pdf.service.ts             # Serviço para geração de PDFs
│   │   │   ├── reserva.service.ts         # Serviço para reservas
│   │   │   └── tipo-contrato.service.ts   # Serviço para tipos de contrato
│   │   ├── styles/                        # Estilos específicos
│   │   │   └── espaco-selecionado.scss
│   │   ├── app.config.ts                  # Configuração da aplicação
│   │   ├── app.config.server.ts           # Configuração do servidor
│   │   ├── app.html                       # Template principal
│   │   ├── app.routes.ts                  # Rotas da aplicação
│   │   ├── app.routes.server.ts           # Rotas do servidor
│   │   ├── app.scss                       # Estilos globais
│   │   ├── app.spec.ts                    # Testes da aplicação
│   │   └── app.ts                         # Componente principal
│   ├── environments/                      # Configurações de ambiente
│   │   ├── environment.prod.ts            # Ambiente de produção
│   │   └── environment.ts                 # Ambiente de desenvolvimento
│   ├── index.html                         # Página HTML principal
│   ├── main.ts                            # Ponto de entrada da aplicação
│   ├── main.server.ts                     # Ponto de entrada do servidor
│   ├── server.ts                          # Configuração do servidor
│   └── styles.scss                        # Estilos globais
├── public/
│   └── favicon.ico                        # Ícone da aplicação
├── angular.json                           # Configuração do Angular CLI
├── package.json                           # Dependências do projeto
├── package-lock.json                      # Lock das dependências
├── tsconfig.json                          # Configuração do TypeScript
├── tsconfig.app.json                      # Configuração do TypeScript para app
├── tsconfig.spec.json                     # Configuração do TypeScript para testes
└── README.md                              # Este arquivo
```

### 📁 Estrutura Específica dos Contratos

```
src/app/feature/gerar-pdf/
├── gerar-pdf.ts           # Componente principal de geração de PDF
├── gerar-pdf.html         # Template do formulário de contratos
├── gerar-pdf.scss         # Estilos específicos
└── gerar-pdf.spec.ts      # Testes do componente

src/app/services/
├── pdf.service.ts         # Serviço para geração de PDFs
├── espaco.service.ts      # Serviço para gerenciar espaços
└── reserva.service.ts     # Serviço para gerenciar reservas

src/app/models/
├── espaco.model.ts        # Modelo de dados do espaço
├── reserva.model.ts       # Modelo de dados da reserva
└── tipo-contrato.model.ts # Modelo de dados do tipo de contrato
```

## 📋 Tipos de Contratos

### 1. Contrato de Locação
- **Dados do Cliente**: Nome, CPF, endereço, telefone
- **Informações do Espaço**: Nome, descrição, capacidade
- **Período de Locação**: Data início e fim
- **Valores**: Total e entrada
- **Texto Personalizado**: Cláusulas e observações customizadas
- **Cláusulas Padrão**: Termos padrão do contrato

### 2. Recibo de Pagamento
- **Dados do Cliente**: Informações completas do cliente
- **Informações do Pagamento**: Valor, data, forma de pagamento
- **Descrição do Serviço**: Detalhes do serviço prestado
- **Texto Personalizado**: Observações e agradecimentos
- **Observações**: Informações adicionais

## ⚙️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd ang-contrato-espaco

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start
# ou
ng serve
```

### Configuração da API

Edite o arquivo `src/app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Altere para sua URL
  ENDPOINTS: {
    ESPACOS: '/espacos',
    RESERVAS: '/reservas',
    CONTRATOS: '/contratos',
    RECIBOS: '/recibos'
  }
};
```

### Dependências Principais

- `@angular/core`: Framework Angular
- `@angular/common/http`: Requisições HTTP
- `@angular/forms`: Formulários reativos
- `jspdf`: Geração de PDFs
- `jspdf-autotable`: Tabelas no PDF

## 🎨 Como Usar

### 1. Acessar o Sistema
Navegue até `http://localhost:4200/` após iniciar o servidor.

### 2. Navegação no Sistema
- **Home**: Página inicial com visão geral
- **Cadastro de Espaços**: Gerenciar espaços disponíveis
- **Cadastro de Reservas**: Criar e gerenciar reservas
- **Cadastro de Tipos de Contrato**: Configurar tipos de contrato
- **Lista de Reservas**: Visualizar todas as reservas
- **Consulta de Festas**: Consultar eventos e festas
- **Gerar PDF**: Criar contratos e recibos

### 3. Geração de Contratos

#### Acessar a Página de Geração de PDF
Navegue até a rota `/gerar-pdf` através do menu de navegação.

#### Selecionar Tipo de Contrato
Use os botões no topo para alternar entre:
- **Contrato de Locação**
- **Recibo de Pagamento**

#### Preencher os Dados
- Campos marcados com `*` são obrigatórios
- Use o campo "Texto Personalizado" para adicionar conteúdo customizado
- Adicione observações se necessário
- Selecione o espaço desejado (se aplicável)

#### Gerar PDF
Clique no botão "Gerar PDF" para criar e baixar o documento.

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

## 📝 Exemplos de Uso

### Exemplo de Contrato de Locação

**Dados do Cliente:**
- Nome: João Silva Santos
- CPF: 123.456.789-00
- Endereço: Rua das Flores, 123, Centro, São Paulo - SP
- Telefone: (11) 99999-9999

**Dados do Espaço:**
- Nome: Salão de Festas Jardim
- Descrição: Espaço amplo com capacidade para 100 pessoas
- Capacidade: 100

**Dados do Contrato:**
- Número: CONT-2024-001
- Data de Início: 15/12/2024
- Data de Fim: 15/01/2025
- Valor Total: R$ 2.500,00
- Valor da Entrada: R$ 500,00

### Exemplo de Recibo de Pagamento

**Dados do Cliente:**
- Nome: Maria Oliveira Costa
- CPF: 987.654.321-00
- Endereço: Av. Paulista, 1000, Bela Vista, São Paulo - SP
- Telefone: (11) 88888-8888

**Dados do Pagamento:**
- Número: REC-2024-001
- Data do Pagamento: 10/12/2024
- Valor: R$ 1.200,00
- Forma de Pagamento: PIX
- Descrição: Pagamento da locação do salão para festa de aniversário

### Exemplo de Código

```typescript
// No componente
constructor(
  private pdfService: PdfService,
  private espacoService: EspacoService
) {}

// Gerar PDF localmente
gerarPDF() {
  const contrato = {
    cliente: { nome: 'João Silva', cpf: '123.456.789-00' },
    espaco: { nome: 'Salão Jardim', capacidade: 100 },
    periodo: { inicio: '2024-12-15', fim: '2025-01-15' },
    valores: { total: 2500, entrada: 500 }
  };
  
  this.pdfService.gerarContratoLocacao(contrato, 'Texto personalizado');
}

// Salvar no servidor
salvarContrato() {
  this.espacoService.criarReserva(this.formulario.value)
    .subscribe(response => {
      console.log('Reserva criada:', response);
    });
}
```

## 🛠️ Desenvolvimento

### Comandos Disponíveis

```bash
# Servidor de desenvolvimento
ng serve
# ou
npm start

# Build para produção
ng build
# ou
npm run build

# Executar testes
ng test
# ou
npm test

# Executar testes e2e
ng e2e
# ou
npm run e2e

# Gerar componente
ng generate component nome-componente

# Gerar serviço
ng generate service nome-servico
```

### Estrutura de Desenvolvimento

- **Componentes**: Organizados em pastas por funcionalidade
- **Serviços**: Centralizados na pasta `services/`
- **Modelos**: Interfaces TypeScript na pasta `models/`
- **Rotas**: Configuradas em `app.routes.ts`
- **Estilos**: SCSS com variáveis CSS customizadas

### Personalização

#### Alterar Cores do Tema
```scss
// src/app/feature/gerar-pdf/gerar-pdf.scss
:root {
  --primary-color: #007bff;    // Azul padrão
  --success-color: #28a745;    // Verde para botões
  --danger-color: #dc3545;     // Vermelho para erros
  --warning-color: #ffc107;    // Amarelo para avisos
}
```

#### Personalizar PDF
O serviço `PdfService` permite personalizar:
- Título e subtítulo
- Margens e espaçamentos
- Logo (futuro)
- Rodapé (futuro)

## 🐛 Solução de Problemas

### PDF não gera
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se o navegador permite downloads
- Verifique o console para erros JavaScript
- Teste com dados de exemplo

### Erro de conexão com API
- Verifique se a URL da API está correta em `api.config.ts`
- Confirme se o servidor backend está rodando
- Verifique as configurações de CORS
- Teste a conectividade de rede

### Formulário não valida
- Certifique-se de que todos os campos obrigatórios estão preenchidos
- Verifique se as datas estão no formato correto
- Confirme se os valores numéricos são válidos
- Verifique as validações customizadas

### Problemas de Performance
- Verifique se há loops infinitos nos observables
- Confirme se os serviços estão sendo injetados corretamente
- Verifique o uso de memória no navegador
- Otimize as consultas à API

### Debugging

```typescript
// Verificar dados do formulário
console.log('Dados do formulário:', this.formulario.value);
console.log('Formulário válido:', this.formulario.valid);

// Verificar erros de API
this.espacoService.getEspacos().subscribe({
  next: (response) => console.log('Sucesso:', response),
  error: (error) => console.error('Erro:', error),
  complete: () => console.log('Requisição concluída')
});
```

## 🔮 Próximas Funcionalidades

### Funcionalidades Planejadas
- [ ] **Upload de Logo**: Personalização de logo nos PDFs
- [ ] **Templates Editáveis**: Criação de templates de contrato personalizáveis
- [ ] **Assinatura Digital**: Implementação de assinatura digital nos contratos
- [ ] **Envio por Email**: Envio automático de contratos por email
- [ ] **Histórico de Contratos**: Visualização do histórico completo
- [ ] **Relatórios Consolidados**: Geração de relatórios estatísticos
- [ ] **Backup Automático**: Sistema de backup automático
- [ ] **Autenticação**: Sistema de login e controle de acesso
- [ ] **Validação de CPF**: Validação automática de CPF
- [ ] **Upload de Arquivos**: Sistema de anexos nos contratos
- [ ] **Dashboard**: Painel de controle com métricas
- [ ] **Notificações**: Sistema de notificações por email/SMS
- [ ] **API REST Completa**: Implementação completa da API
- [ ] **Testes Automatizados**: Cobertura completa de testes
- [ ] **Documentação da API**: Documentação Swagger/OpenAPI

### Melhorias Técnicas
- [ ] **PWA**: Transformar em Progressive Web App
- [ ] **Offline Support**: Funcionalidade offline
- [ ] **Cache Inteligente**: Sistema de cache otimizado
- [ ] **Lazy Loading**: Carregamento sob demanda
- [ ] **Micro-frontends**: Arquitetura de micro-frontends
- [ ] **Docker**: Containerização da aplicação
- [ ] **CI/CD**: Pipeline de integração contínua

## 📚 Recursos Adicionais

### Documentação Angular
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)

### Ferramentas de Desenvolvimento
- [VS Code](https://code.visualstudio.com)
- [Angular DevTools](https://angular.dev/tools/devtools)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

### Bibliotecas Utilizadas
- [jsPDF](https://github.com/parallax/jsPDF) - Geração de PDFs
- [jsPDF AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) - Tabelas em PDF
- [Angular Forms](https://angular.dev/guide/forms) - Formulários reativos

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar pull requests.

## 📞 Suporte

Para suporte e dúvidas, entre em contato através dos canais oficiais do projeto.

---

**Desenvolvido com ❤️ usando Angular**
