import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Relatorio } from '../models/relatorio.model';
import { TipoContrato } from '../models/tipo-contrato.model';

// Extensão do jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  /**
   * Gera PDF para Relatório (Contrato ou Recibo)
   */
  gerarRelatorio(relatorio: Relatorio, tipoContrato: TipoContrato): void {
    const doc = new jsPDF();

    // Processar o template substituindo os placeholders
    const textoProcessado = this.processarTemplate(tipoContrato.textoTemplate, relatorio);

    // Adicionar o texto processado ao PDF
    const linhas = textoProcessado.split('\n');

    let yPosition = 20;

    for (const linha of linhas) {
      if (linha.trim()) {
        // Verificar se precisa de nova página
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Adicionar linha ao PDF
        const linhasTexto = doc.splitTextToSize(linha, 170);
        doc.text(linhasTexto, 20, yPosition);
        yPosition += (linhasTexto.length * 6) + 3;
      } else {
        // Linha em branco
        yPosition += 6;
      }
    }

    // Salvar PDF
    const nomeArquivo = `${tipoContrato.tipo.toLowerCase()}_${relatorio.nomeCliente.replace(/\s+/g, '_')}_${this.formatarData(new Date())}.pdf`;
    doc.save(nomeArquivo);
  }

  /**
   * Processa o template substituindo os placeholders
   */
  private processarTemplate(template: string, relatorio: Relatorio): string {
    return template
      .replace(/{nome}/g, relatorio.nomeCliente)
      .replace(/{cpf}/g, relatorio.cpfCliente)
      .replace(/{valor}/g, `R$ ${relatorio.valorPago.toFixed(2)}`)
      .replace(/{dataFesta}/g, this.formatarData(new Date(relatorio.dataFesta)))
      .replace(/{horaInicio}/g, relatorio.horaInicio)
      .replace(/{horaFim}/g, relatorio.horaFim)
      .replace(/{valorIntegral}/g, relatorio.valorIntegral ? 'Integral' : 'Parcial');
  }

  /**
   * Formata data para exibição
   */
  private formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR');
  }

  /**
   * Gera PDF simples com dados básicos
   */
  gerarPDFSimples(titulo: string, conteudo: string): void {
    const doc = new jsPDF();

    let yPosition = 20;

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 105, yPosition, { align: 'center' });
    yPosition += 20;

    // Conteúdo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const linhas = doc.splitTextToSize(conteudo, 170);
    doc.text(linhas, 20, yPosition);

    // Salvar PDF
    const nomeArquivo = `${titulo.toLowerCase().replace(/\s+/g, '_')}_${this.formatarData(new Date())}.pdf`;
    doc.save(nomeArquivo);
  }
}
