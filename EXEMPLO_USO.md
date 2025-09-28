# Exemplo de Uso do Sistema de Contratos

## 🎯 Demonstração Rápida

### 1. Acessar a Página
Navegue para `/contrato` no seu navegador.

### 2. Exemplo de Contrato de Locação

**Dados do Cliente:**
- Nome: João Silva Santos
- CPF: 123.456.789-00
- Endereço: Rua das Flores, 123, Centro, São Paulo - SP
- Telefone: (11) 99999-9999

**Dados do Espaço:**
- Nome: Salão de Festas Jardim
- Descrição: Espaço amplo com capacidade para 100 pessoas, equipado com sistema de som, iluminação e cozinha completa.
- Capacidade: 100

**Dados do Contrato:**
- Número: CONT-2024-001
- Data de Início: 15/12/2024
- Data de Fim: 15/01/2025
- Valor Total: R$ 2.500,00
- Valor da Entrada: R$ 500,00

**Texto Personalizado:**
```
O locatário se compromete a:
- Não realizar eventos com mais de 100 pessoas
- Respeitar o horário de funcionamento (8h às 22h)
- Deixar o espaço limpo após o uso
- Não consumir bebidas alcoólicas em excesso
```

### 3. Exemplo de Recibo de Pagamento

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
- Nome do Espaço: Salão de Festas Jardim
- Descrição: Pagamento da locação do salão para festa de aniversário no dia 20/12/2024

**Texto Personalizado:**
```
Pagamento realizado com sucesso.
Obrigado pela preferência!
```

## 🔧 Configuração da API

### Para Desenvolvimento Local
```typescript
// src/app/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  // ... resto da configuração
};
```

### Para Produção
```typescript
// src/app/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'https://api.seudominio.com/api',
  // ... resto da configuração
};
```

## 📱 Testando no Navegador

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

2. **Acesse:** `http://localhost:4200/contrato`

3. **Teste os formulários:**
   - Preencha os dados de exemplo acima
   - Clique em "Gerar PDF"
   - O arquivo será baixado automaticamente

## 🚀 Integração com Backend

### Exemplo de Endpoint para Contrato de Locação

```javascript
// Backend (Node.js/Express)
app.post('/api/contratos/locacao', (req, res) => {
  const contrato = req.body;
  
  // Salvar no banco de dados
  const contratoSalvo = await ContratoModel.create(contrato);
  
  // Gerar PDF no servidor (opcional)
  const pdfBuffer = await gerarPDFContrato(contratoSalvo);
  
  res.json(contratoSalvo);
});

app.get('/api/contratos/locacao/:id/pdf', async (req, res) => {
  const contrato = await ContratoModel.findById(req.params.id);
  const pdfBuffer = await gerarPDFContrato(contrato);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="contrato_${contrato.numero}.pdf"`);
  res.send(pdfBuffer);
});
```

### Exemplo de Uso no Frontend

```typescript
// No componente Angular
async salvarContrato() {
  try {
    const contrato = this.formContratoLocacao.value;
    
    // Salvar no servidor
    const contratoSalvo = await this.contratoService.criarContratoLocacao(contrato).toPromise();
    
    // Gerar PDF localmente
    this.pdfService.gerarContratoLocacao(contratoSalvo);
    
    console.log('Contrato salvo e PDF gerado!');
  } catch (error) {
    console.error('Erro ao salvar contrato:', error);
  }
}
```

## 🎨 Personalização

### Alterar Cores do Tema
```scss
// src/app/feature/contrato/contrato.scss
:root {
  --primary-color: #007bff;    // Azul padrão
  --success-color: #28a745;    // Verde para botões
  --danger-color: #dc3545;     // Vermelho para erros
  --warning-color: #ffc107;    // Amarelo para avisos
}
```

### Adicionar Logo ao PDF
```typescript
// src/app/services/pdf.service.ts
private adicionarLogo(doc: jsPDF, yPosition: number): number {
  // Adicionar logo se disponível
  if (this.configuracaoPadrao.logo) {
    doc.addImage(this.configuracaoPadrao.logo, 'PNG', 20, yPosition, 30, 20);
    yPosition += 25;
  }
  return yPosition;
}
```

## 🔍 Debugging

### Verificar se os Dados Estão Corretos
```typescript
// No componente
gerarPDFContratoLocacao(): void {
  console.log('Dados do formulário:', this.formContratoLocacao.value);
  console.log('Formulário válido:', this.formContratoLocacao.valid);
  
  // ... resto do código
}
```

### Verificar Erros de API
```typescript
// No serviço
this.contratoService.criarContratoLocacao(contrato).subscribe({
  next: (response) => console.log('Sucesso:', response),
  error: (error) => console.error('Erro:', error),
  complete: () => console.log('Requisição concluída')
});
```

## 📊 Monitoramento

### Logs de Geração de PDF
```typescript
// Adicionar logs no PdfService
gerarContratoLocacao(contrato: ContratoLocacao, textoPersonalizado?: string): void {
  console.log('Iniciando geração de PDF para contrato:', contrato.numero);
  console.log('Texto personalizado:', textoPersonalizado);
  
  // ... código de geração
  
  console.log('PDF gerado com sucesso!');
}
```

## 🎯 Próximos Passos

1. **Implementar autenticação** para proteger os endpoints
2. **Adicionar validação de CPF** no frontend
3. **Implementar upload de arquivos** para anexos
4. **Criar dashboard** para visualizar contratos
5. **Adicionar notificações** por email/SMS
6. **Implementar assinatura digital**

