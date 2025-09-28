import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { Reserva } from '../../models/reserva.model';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-lista-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-reservas.html',
  styleUrl: './lista-reservas.scss'
})
export class ListaReservas implements OnInit {

  reservas = signal<Reserva[]>([]);
  espacos = signal<Espaco[]>([]);
  tiposContrato = signal<TipoContrato[]>([]);
  loading = signal<boolean>(false);
  reservaExpandida = signal<number | null>(null);

  // Filtros
  filtroEspaco = signal<number | null>(null);
  filtroMes = signal<string>('');
  filtroPagamento = signal<string>('todos'); // 'todos', 'integral', 'parcial'

  // Paginação
  paginaAtual = signal<number>(1);
  itensPorPagina = signal<number>(5);

  constructor(
    private reservaService: ReservaService,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService,
    private router: Router
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

  // Métodos de filtro
  filtrarPorEspaco(reservas: Reserva[], espacoId: number): Reserva[] {
    return reservas.filter(reserva => reserva.espacoId === espacoId);
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

  // Navegar para cadastro de reserva
  registrarReserva() {
    this.router.navigate(['/cadastro-reserva']);
  }

  // Editar reserva
  editarReserva(reserva: Reserva) {
    // Navegar para cadastro-reserva com parâmetros de edição
    this.router.navigate(['/cadastro-reserva'], {
      queryParams: {
        modo: 'edicao',
        id: reserva.id
      }
    });
  }

  // Excluir reserva
  async excluirReserva(reserva: Reserva) {
    if (confirm(`Tem certeza que deseja excluir a reserva de ${reserva.nomeCliente}?`)) {
      try {
        await this.reservaService.excluirReserva(reserva.id!).toPromise();
        // Atualização otimista da lista local
        this.reservas.set(this.reservas().filter(r => r.id !== reserva.id));
        console.log('Reserva excluída com sucesso!');
      } catch (error: any) {
        console.error('Erro ao excluir reserva:', error);
        alert('Erro ao excluir reserva. Tente novamente.');
        // Em caso de erro, recarregar a lista para garantir consistência
        this.carregarReservas();
      }
    }
  }

  // Gerar relatório
  gerarPdf(reserva: Reserva) {
    // Navegar para gerar-pdf com o ID da reserva
    this.router.navigate(['/gerar-pdf'], {
      queryParams: {
        reservaId: reserva.id
      }
    });
  }
}
