import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { RelatorioService } from '../../services/relatorio.service';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';
import { Relatorio } from '../../models/relatorio.model';

@Component({
  selector: 'app-gerar-relatorio',
  imports: [CommonModule, FormsModule],
  templateUrl: './gerar-relatorio.html',
  styleUrl: './gerar-relatorio.scss'
})
export class GerarRelatorio implements OnInit {

  espacos = signal<Espaco[]>([]);
  tiposContrato = signal<TipoContrato[]>([]);
  relatorios = signal<Relatorio[]>([]);
  loading = signal<boolean>(false);
  salvando = signal<boolean>(false);

  // Formulário
  novoRelatorio: Relatorio = {
    tipoContratoId: 0,
    nomeCliente: '',
    cpfCliente: '',
    dataFesta: '',
    horaInicio: '',
    horaFim: '',
    valorPago: 0,
    valorIntegral: false
  };

  // Filtros
  espacoFiltro = signal<number>(0);
  tipoFiltro = signal<'CONTRATO' | 'RECIBO' | ''>('');

  constructor(
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit() {
    this.carregarEspacos();
    this.carregarTiposContrato();
    this.carregarRelatorios();
  }

  async carregarEspacos() {
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
      console.error('Erro ao carregar espaços. Verifique se o backend está rodando.');
    }
  }

  async carregarTiposContrato() {
    try {
      const tiposContrato = await this.tipoContratoService.listarTiposContrato().toPromise();
      this.tiposContrato.set(tiposContrato || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de contrato:', error);
      console.error('Erro ao carregar tipos de contrato.');
    }
  }

  async carregarRelatorios() {
    this.loading.set(true);
    try {
      const relatorios = await this.relatorioService.listarRelatorios().toPromise();
      this.relatorios.set(relatorios || []);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      console.error('Erro ao carregar relatórios.');
    } finally {
      this.loading.set(false);
    }
  }

  getTiposContratoFiltrados(): TipoContrato[] {
    let tipos = this.tiposContrato();

    if (this.espacoFiltro() > 0) {
      tipos = tipos.filter(tc => tc.espacoId === this.espacoFiltro());
    }

    if (this.tipoFiltro()) {
      tipos = tipos.filter(tc => tc.tipo === this.tipoFiltro());
    }

    return tipos;
  }

  getRelatoriosFiltrados(): Relatorio[] {
    let relatorios = this.relatorios();

    if (this.espacoFiltro() > 0) {
      const tiposContratoFiltrados = this.tiposContrato().filter(tc => tc.espacoId === this.espacoFiltro());
      const idsFiltrados = tiposContratoFiltrados.map(tc => tc.id!);
      relatorios = relatorios.filter(r => idsFiltrados.includes(r.tipoContratoId));
    }

    if (this.tipoFiltro()) {
      const tiposContratoFiltrados = this.tiposContrato().filter(tc => tc.tipo === this.tipoFiltro());
      const idsFiltrados = tiposContratoFiltrados.map(tc => tc.id!);
      relatorios = relatorios.filter(r => idsFiltrados.includes(r.tipoContratoId));
    }

    return relatorios;
  }

  formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  async salvarRelatorio() {
    if (!this.novoRelatorio.tipoContratoId) {
      console.warn('Selecione um tipo de contrato');
      return;
    }

    if (!this.novoRelatorio.nomeCliente.trim()) {
      console.warn('Nome do cliente é obrigatório');
      return;
    }

    if (!this.novoRelatorio.cpfCliente.trim()) {
      console.warn('CPF do cliente é obrigatório');
      return;
    }

    if (!this.novoRelatorio.dataFesta) {
      console.warn('Data da festa é obrigatória');
      return;
    }

    if (!this.novoRelatorio.horaInicio) {
      console.warn('Hora de início é obrigatória');
      return;
    }

    if (!this.novoRelatorio.horaFim) {
      console.warn('Hora de fim é obrigatória');
      return;
    }

    if (this.novoRelatorio.valorPago <= 0) {
      console.warn('Valor pago deve ser maior que zero');
      return;
    }

    this.salvando.set(true);
    try {
      const relatorioSalvo = await this.relatorioService.criarRelatorio(this.novoRelatorio).toPromise();
      this.relatorios.set([...this.relatorios(), relatorioSalvo!]);

      // Limpar formulário
      this.novoRelatorio = {
        tipoContratoId: 0,
        nomeCliente: '',
        cpfCliente: '',
        dataFesta: '',
        horaInicio: '',
        horaFim: '',
        valorPago: 0,
        valorIntegral: false
      };

      console.log('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      console.error('Erro ao salvar relatório.');
    } finally {
      this.salvando.set(false);
    }
  }

  async excluirRelatorio(id: number) {
    // No servidor, não há confirm, então apenas executa
    // if (!confirm('Tem certeza que deseja excluir este relatório?')) {
    //   return;
    // }

    try {
      await this.relatorioService.excluirRelatorio(id).toPromise();
      this.relatorios.set(this.relatorios().filter(r => r.id !== id));
      console.log('Relatório excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      console.error('Erro ao excluir relatório.');
    }
  }

  getTipoContratoInfo(tipoContratoId: number): { espaco: string, tipo: string } {
    const tipoContrato = this.tiposContrato().find(tc => tc.id === tipoContratoId);
    if (tipoContrato) {
      const espaco = this.espacos().find(e => e.id === tipoContrato.espacoId);
      return {
        espaco: espaco ? espaco.nome : 'Espaço não encontrado',
        tipo: tipoContrato.tipo
      };
    }
    return { espaco: 'Não encontrado', tipo: 'Não encontrado' };
  }

  async baixarPdf(id: number) {
    try {
      console.log('Gerando PDF para relatório ID:', id);
      const blob = await this.relatorioService.gerarPdf(id).toPromise();

      if (blob) {
        // Criar URL do blob
        const url = window.URL.createObjectURL(blob);

        // Criar elemento de download
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_${id}.pdf`;

        // Adicionar ao DOM, clicar e remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpar URL do blob
        window.URL.revokeObjectURL(url);

        console.log('PDF baixado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      console.error('Erro ao gerar PDF do relatório.');
    }
  }
}
