import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatorioService } from '../../services/relatorio.service';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { Relatorio } from '../../models/relatorio.model';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-consulta-festas',
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-festas.html',
  styleUrl: './consulta-festas.scss'
})
export class ConsultaFestas implements OnInit {

  relatorios = signal<Relatorio[]>([]);
  espacos = signal<Espaco[]>([]);
  tiposContrato = signal<TipoContrato[]>([]);
  loading = signal<boolean>(false);
  relatorioExpandido = signal<number | null>(null);

  // Filtros
  filtroSemana = signal<boolean>(false);
  mostrarCaixasTexto = signal<boolean>(false);

  constructor(
    private relatorioService: RelatorioService,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService
  ) {}

  ngOnInit() {
    this.carregarRelatorios();
    this.carregarEspacos();
    this.carregarTiposContrato();
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

  async carregarEspacos() {
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
    }
  }

  async carregarTiposContrato() {
    try {
      const tiposContrato = await this.tipoContratoService.listarTiposContrato().toPromise();
      this.tiposContrato.set(tiposContrato || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de contrato:', error);
    }
  }

  getRelatoriosFiltrados(): Relatorio[] {
    let relatorios = this.relatorios();

    if (this.filtroSemana()) {
      relatorios = this.filtrarFestasDaSemana(relatorios);
    }

    // Ordenar por data da festa
    return relatorios.sort((a, b) => new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime());
  }

  filtrarFestasDaSemana(relatorios: Relatorio[]): Relatorio[] {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);

    // Calcular o início da semana (segunda-feira)
    // getDay() retorna: 0=domingo, 1=segunda, 2=terça, ..., 6=sábado
    const diaDaSemana = hoje.getDay();
    const diasParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana; // Se domingo, volta 6 dias; senão, calcula dias para segunda
    inicioSemana.setDate(hoje.getDate() + diasParaSegunda);
    inicioSemana.setHours(0, 0, 0, 0);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6); // Domingo (6 dias após segunda)
    fimSemana.setHours(23, 59, 59, 999);

    return relatorios.filter(relatorio => {
      const dataFesta = new Date(relatorio.dataFesta);
      return dataFesta >= inicioSemana && dataFesta <= fimSemana;
    });
  }

  formatarDataComDiaSemana(data: string): string {
    if (!data) return '';

    const dataObj = new Date(data + 'T00:00:00');
    const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    const dataFormatada = dataObj.toLocaleDateString('pt-BR');

    // Capitaliza a primeira letra do dia da semana
    const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

    return `${dataFormatada} (${diaSemanaCapitalizado})`;
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarCPF(cpf: string): string {
    // Remove todos os caracteres não numéricos
    const numeros = cpf.replace(/\D/g, '');

    // Aplica máscara baseada no tamanho
    if (numeros.length <= 11) {
      // CPF: 000.000.000-00
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  }

  alternarDetalhes(id: number) {
    if (this.relatorioExpandido() === id) {
      this.relatorioExpandido.set(null);
    } else {
      this.relatorioExpandido.set(id);
    }
  }

  getStatusPagamento(relatorio: Relatorio): string {
    return relatorio.valorIntegral ? 'Integral' : 'Parcial';
  }

  getStatusPagamentoClass(relatorio: Relatorio): string {
    return relatorio.valorIntegral ? 'integral' : 'parcial';
  }

  // Métodos para caixas de texto das festas da semana
  getFestasPorEspaco(): { espaco: Espaco, festas: Relatorio[] }[] {
    const festasDaSemana = this.filtrarFestasDaSemana(this.relatorios());
    const festasPorEspaco: { [key: number]: Relatorio[] } = {};

    // Agrupar festas por espaço
    festasDaSemana.forEach(relatorio => {
      const tipoContrato = this.tiposContrato().find(tc => tc.id === relatorio.tipoContratoId);
      if (tipoContrato) {
        const espacoId = tipoContrato.espacoId;
        if (!festasPorEspaco[espacoId]) {
          festasPorEspaco[espacoId] = [];
        }
        festasPorEspaco[espacoId].push(relatorio);
      }
    });

    // Converter para array e ordenar por data
    return Object.keys(festasPorEspaco).map(espacoId => {
      const espaco = this.espacos().find(e => e.id === parseInt(espacoId));
      const festas = festasPorEspaco[parseInt(espacoId)].sort((a, b) =>
        new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime()
      );
      return { espaco: espaco!, festas };
    }).filter(item => item.espaco); // Filtrar espaços não encontrados
  }

  gerarTextoFestas(espaco: Espaco, festas: Relatorio[]): string {
    let texto = `FESTAS DA SEMANA - ${espaco.nome.toUpperCase()}\n`;
    texto += `${'='.repeat(50)}\n\n`;

    festas.forEach((relatorio, index) => {
      const tipoContrato = this.tiposContrato().find(tc => tc.id === relatorio.tipoContratoId);
      const statusPagamento = relatorio.valorIntegral ? 'INTEGRAL' : 'PARCIAL';

      texto += `${index + 1}. ${relatorio.nomeCliente}\n`;
      texto += `   Data: ${this.formatarDataComDiaSemana(relatorio.dataFesta)}\n`;
      texto += `   Horário: ${relatorio.horaInicio} às ${relatorio.horaFim}\n`;
      texto += `   Pagamento: ${statusPagamento}\n`;
      if (tipoContrato) {
        texto += `   Tipo: ${tipoContrato.tipo}${tipoContrato.descricao ? ` (${tipoContrato.descricao})` : ''}\n`;
      }
      texto += `\n`;
    });

    return texto;
  }

  async copiarTexto(espaco: Espaco, festas: Relatorio[]) {
    const texto = this.gerarTextoFestas(espaco, festas);

    try {
      await navigator.clipboard.writeText(texto);
      console.log('Texto copiado para a área de transferência!');
      // Aqui você pode adicionar uma notificação visual se quiser
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      // Fallback para navegadores mais antigos
      this.copiarTextoFallback(texto);
    }
  }

  private copiarTextoFallback(texto: string) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Texto copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
    }
    document.body.removeChild(textArea);
  }

  ativarFiltroSemana() {
    this.filtroSemana.set(!this.filtroSemana());
    this.mostrarCaixasTexto.set(this.filtroSemana());
  }
}
