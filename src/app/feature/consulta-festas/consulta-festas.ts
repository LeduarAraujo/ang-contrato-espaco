import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { Reserva } from '../../models/reserva.model';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-consulta-festas',
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-festas.html',
  styleUrl: './consulta-festas.scss'
})
export class ConsultaFestas implements OnInit {

  reservas = signal<Reserva[]>([]);
  espacos = signal<Espaco[]>([]);
  tiposContrato = signal<TipoContrato[]>([]);
  loading = signal<boolean>(false);
  reservaExpandida = signal<number | null>(null);

  // Filtros
  filtroSemana = signal<boolean>(false);
  mostrarCaixasTexto = signal<boolean>(false);
  mostrarDatasDisponiveis = signal<boolean>(false);
  mostrarModalDatas = signal<boolean>(false);

  // Novos filtros
  filtroEspaco = signal<number | null>(null);
  filtroMes = signal<string>('');
  filtroPagamento = signal<string>('todos'); // 'todos', 'integral', 'parcial'

  // Paginação
  paginaAtual = signal<number>(1);
  itensPorPagina = signal<number>(5);

  // Configurações do modal de datas
  dataInicio = signal<string>('');
  dataFim = signal<string>('');
  tipoDias = signal<'todos' | 'finais' | 'dias-semana'>('todos');

  constructor(
    private reservaService: ReservaService,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService
  ) {}

  ngOnInit() {
    this.carregarReservas();
    this.carregarEspacos();
    this.carregarTiposContrato();
  }

  async carregarReservas() {
    this.loading.set(true);
    try {
      const reservas = await this.reservaService.listarReservas().toPromise();
      this.reservas.set(reservas || []);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
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

  getReservasFiltradas(): Reserva[] {
    let reservas = this.reservas();

    // Filtro por semana
    if (this.filtroSemana()) {
      reservas = this.filtrarFestasDaSemana(reservas);
    }

    // Filtro por espaço
    if (this.filtroEspaco()) {
      reservas = this.filtrarPorEspaco(reservas, this.filtroEspaco()!);
    }

    // Filtro por mês
    if (this.filtroMes()) {
      reservas = this.filtrarPorMes(reservas, this.filtroMes()!);
    }

    // Filtro por pagamento
    if (this.filtroPagamento() && this.filtroPagamento() !== 'todos') {
      reservas = this.filtrarPorPagamento(reservas, this.filtroPagamento()!);
    }

    // Ordenar por data da festa
    return reservas.sort((a, b) => new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime());
  }

  filtrarFestasDaSemana(reservas: Reserva[]): Reserva[] {
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

    return reservas.filter(reserva => {
      const dataFesta = new Date(reserva.dataFesta);
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
    if (this.reservaExpandida() === id) {
      this.reservaExpandida.set(null);
    } else {
      this.reservaExpandida.set(id);
    }
  }

  getStatusPagamento(reserva: Reserva): string {
    return reserva.valorIntegral ? 'Integral' : 'Parcial';
  }

  getStatusPagamentoClass(reserva: Reserva): string {
    return reserva.valorIntegral ? 'integral' : 'parcial';
  }

  // Métodos para caixas de texto das festas da semana
  getFestasPorEspaco(): { espaco: Espaco, festas: Reserva[] }[] {
    const festasDaSemana = this.filtrarFestasDaSemana(this.reservas());
    const festasPorEspaco: { [key: number]: Reserva[] } = {};

    // Agrupar festas por espaço
    festasDaSemana.forEach(reserva => {
      const espacoId = reserva.espacoId;
      if (!festasPorEspaco[espacoId]) {
        festasPorEspaco[espacoId] = [];
      }
      festasPorEspaco[espacoId].push(reserva);
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

  gerarTextoFestas(espaco: Espaco, festas: Reserva[]): string {
    let texto = `FESTAS DA SEMANA - ${espaco.nome.toUpperCase()}\n`;
    texto += `${'='.repeat(50)}\n\n`;

    festas.forEach((reserva, index) => {
      const statusPagamento = reserva.valorIntegral ? 'INTEGRAL' : 'PARCIAL';

      texto += `${index + 1}. ${reserva.nomeCliente}\n`;
      texto += `   Data: ${this.formatarDataComDiaSemana(reserva.dataFesta)}\n`;
      texto += `   Horário: ${reserva.horaInicio} às ${reserva.horaFim}\n`;
      texto += `   Telefone: ${reserva.telefoneCliente}\n`;
      texto += `   Valor: R$ ${reserva.valorPagamento.toFixed(2)}\n`;
      texto += `   Pagamento: ${statusPagamento}\n`;
      if (reserva.valorRestante && reserva.valorRestante > 0) {
        texto += `   Restante: R$ ${reserva.valorRestante.toFixed(2)}\n`;
      }
      texto += `\n`;
    });

    return texto;
  }

  async copiarTexto(espaco: Espaco, festas: Reserva[]) {
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

  // Métodos para datas disponíveis
  abrirModalDatas() {
    // Definir datas padrão (próximos 30 dias)
    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setDate(hoje.getDate() + 30);

    this.dataInicio.set(hoje.toISOString().split('T')[0]);
    this.dataFim.set(dataFim.toISOString().split('T')[0]);
    this.tipoDias.set('todos');
    this.mostrarModalDatas.set(true);
  }

  fecharModalDatas() {
    this.mostrarModalDatas.set(false);
  }


  getDatasDisponiveisPorEspaco(): { espaco: Espaco, datas: string[] }[] {
    const datasDisponiveis: { [key: number]: string[] } = {};
    const espacos = this.espacos();

    // Inicializar array de datas para cada espaço
    espacos.forEach(espaco => {
      datasDisponiveis[espaco.id!] = [];
    });

    // Gerar todas as datas no período
    const dataInicio = new Date(this.dataInicio());
    const dataFim = new Date(this.dataFim());
    const todasAsDatas: string[] = [];

    for (let data = new Date(dataInicio); data <= dataFim; data.setDate(data.getDate() + 1)) {
      const dataStr = data.toISOString().split('T')[0];
      todasAsDatas.push(dataStr);
    }

    // Filtrar datas por tipo de dia
    const datasFiltradas = this.filtrarDatasPorTipo(todasAsDatas);

    // Para cada espaço, verificar quais datas não têm festas
    espacos.forEach(espaco => {
      const tiposContratoEspaco = this.tiposContrato().filter(tc => tc.espacoId === espaco.id);
      const idsTiposContrato = tiposContratoEspaco.map(tc => tc.id!);

      datasFiltradas.forEach(data => {
        const temFesta = this.reservas().some(reserva =>
          reserva.dataFesta === data && idsTiposContrato.includes(reserva.espacoId)
        );

        if (!temFesta) {
          datasDisponiveis[espaco.id!].push(data);
        }
      });
    });

    // Converter para array e filtrar espaços com datas disponíveis
    return Object.keys(datasDisponiveis).map(espacoId => {
      const espaco = espacos.find(e => e.id === parseInt(espacoId));
      const datas = datasDisponiveis[parseInt(espacoId)];
      return { espaco: espaco!, datas };
    }).filter(item => item.espaco && item.datas.length > 0);
  }

  filtrarDatasPorTipo(datas: string[]): string[] {
    const tipo = this.tipoDias();

    if (tipo === 'todos') {
      return datas;
    }

    return datas.filter(data => {
      const dataObj = new Date(data + 'T00:00:00');
      const diaSemana = dataObj.getDay(); // 0=domingo, 1=segunda, ..., 6=sábado

      if (tipo === 'finais') {
        return diaSemana === 0 || diaSemana === 6; // Domingo ou sábado
      } else if (tipo === 'dias-semana') {
        return diaSemana >= 1 && diaSemana <= 5; // Segunda a sexta
      }

      return true;
    });
  }

  gerarTextoDatasDisponiveis(espaco: Espaco, datas: string[]): string {
    let texto = `DATAS DISPONÍVEIS - ${espaco.nome.toUpperCase()}\n`;
    texto += `${'='.repeat(50)}\n\n`;

    if (datas.length === 0) {
      texto += 'Nenhuma data disponível no período selecionado.\n';
      return texto;
    }

    // Agrupar datas por mês
    const datasPorMes: { [key: string]: string[] } = {};

    datas.forEach(data => {
      const dataObj = new Date(data + 'T00:00:00');
      const mesAno = `${dataObj.getMonth() + 1}/${dataObj.getFullYear()}`;

      if (!datasPorMes[mesAno]) {
        datasPorMes[mesAno] = [];
      }
      datasPorMes[mesAno].push(data);
    });

    // Ordenar meses
    const mesesOrdenados = Object.keys(datasPorMes).sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      return anoA - anoB || mesA - mesB;
    });

    mesesOrdenados.forEach(mesAno => {
      const datasDoMes = datasPorMes[mesAno].sort();

      datasDoMes.forEach(data => {
        const dataObj = new Date(data + 'T00:00:00');
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        texto += `${dia}/${mes}\n`;
      });
    });

    return texto;
  }

  async copiarTextoDatas(espaco: Espaco, datas: string[]) {
    const texto = this.gerarTextoDatasDisponiveis(espaco, datas);

    try {
      await navigator.clipboard.writeText(texto);
      console.log('Texto copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      this.copiarTextoFallback(texto);
    }
  }

  // Métodos de filtro
  filtrarPorEspaco(reservas: Reserva[], espacoId: number): Reserva[] {
    return reservas.filter(reserva => {
      return reserva.espacoId === espacoId;
    });
  }

  filtrarPorMes(reservas: Reserva[], mesAno: string): Reserva[] {
    const [mes, ano] = mesAno.split('/').map(Number);
    return reservas.filter(reserva => {
      const dataFesta = new Date(reserva.dataFesta);
      return dataFesta.getMonth() + 1 === mes && dataFesta.getFullYear() === ano;
    });
  }

  filtrarPorPagamento(reservas: Reserva[], tipoPagamento: string): Reserva[] {
    return reservas.filter(reserva => {
      if (tipoPagamento === 'integral') {
        return reserva.valorIntegral;
      } else if (tipoPagamento === 'parcial') {
        return !reserva.valorIntegral;
      }
      return true;
    });
  }

  // Métodos de paginação
  getReservasPaginadas(): Reserva[] {
    const reservasFiltradas = this.getReservasFiltradas();
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    const fim = inicio + this.itensPorPagina();
    return reservasFiltradas.slice(inicio, fim);
  }

  getTotalPaginas(): number {
    const totalItens = this.getReservasFiltradas().length;
    return Math.ceil(totalItens / this.itensPorPagina());
  }

  getPaginas(): number[] {
    const totalPaginas = this.getTotalPaginas();
    const paginas: number[] = [];
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  irParaPagina(pagina: number) {
    const totalPaginas = this.getTotalPaginas();
    if (pagina >= 1 && pagina <= totalPaginas) {
      this.paginaAtual.set(pagina);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual() > 1) {
      this.paginaAtual.set(this.paginaAtual() - 1);
    }
  }

  proximaPagina() {
    const totalPaginas = this.getTotalPaginas();
    if (this.paginaAtual() < totalPaginas) {
      this.paginaAtual.set(this.paginaAtual() + 1);
    }
  }

  // Métodos para resetar filtros
  limparFiltros() {
    this.filtroEspaco.set(null);
    this.filtroMes.set('');
    this.filtroPagamento.set('todos');
    this.paginaAtual.set(1);
  }

  // Método para obter nome do espaço
  getNomeEspaco(reserva: Reserva): string {
    const espaco = this.espacos().find(e => e.id === reserva.espacoId);
    return espaco ? espaco.nome : 'Espaço não encontrado';
  }

  // Método para obter opções de mês
  getOpcoesMes(): string[] {
    const meses: string[] = [];
    const reservas = this.reservas();

    reservas.forEach(reserva => {
      const dataFesta = new Date(reserva.dataFesta);
      const mesAno = `${dataFesta.getMonth() + 1}/${dataFesta.getFullYear()}`;
      if (!meses.includes(mesAno)) {
        meses.push(mesAno);
      }
    });

    return meses.sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      return anoA - anoB || mesA - mesB;
    });
  }

  // Método para formatar mês para exibição
  formatarMes(mesAno: string): string {
    const [mes, ano] = mesAno.split('/').map(Number);
    const nomesMeses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${nomesMeses[mes - 1]} ${ano}`;
  }
}
