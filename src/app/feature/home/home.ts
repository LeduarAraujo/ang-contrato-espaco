import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  // Signals para os dados reais
  espacosCount = signal<number>(0);
  tiposContratoCount = signal<number>(0);
  reservasCount = signal<number>(0);
  loading = signal<boolean>(true);

  // Signals para festas do dia
  festasHoje = signal<FestaHoje[]>([]);
  modalFestaAberto = signal<boolean>(false);
  festaSelecionada = signal<FestaHoje | null>(null);

  constructor(
    private router: Router,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService,
    private reservaService: ReservaService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    this.loading.set(true);
    try {
      // Carregar dados em paralelo
      const [espacos, tiposContrato, reservas] = await Promise.all([
        this.espacoService.listarEspacos().toPromise(),
        this.tipoContratoService.listarTiposContrato().toPromise(),
        this.reservaService.listarReservas().toPromise()
      ]);

      // Atualizar os contadores
      this.espacosCount.set(espacos?.length || 0);
      this.tiposContratoCount.set(tiposContrato?.length || 0);
      this.reservasCount.set(reservas?.length || 0);

      // Carregar festas do dia
      await this.carregarFestasHoje(reservas || [], espacos || []);

      console.log('Dados carregados:', {
        espacos: this.espacosCount(),
        tiposContrato: this.tiposContratoCount(),
        reservas: this.reservasCount()
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, manter valores padrão
      this.espacosCount.set(0);
      this.tiposContratoCount.set(0);
      this.reservasCount.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  async carregarFestasHoje(reservas: Reserva[], espacos: any[]) {
    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const festasHoje: FestaHoje[] = [];

    // Filtrar reservas de hoje
    const reservasHoje = reservas.filter(reserva => reserva.dataFesta === hoje);

    // Agrupar por espaço
    const espacosComFestas = new Map<number, Reserva[]>();
    reservasHoje.forEach(reserva => {
      if (!espacosComFestas.has(reserva.espacoId)) {
        espacosComFestas.set(reserva.espacoId, []);
      }
      espacosComFestas.get(reserva.espacoId)!.push(reserva);
    });

    // Criar lista de festas
    espacosComFestas.forEach((reservasEspaco, espacoId) => {
      const espaco = espacos.find(e => e.id === espacoId);
      if (espaco) {
        festasHoje.push({
          espacoId: espacoId,
          espacoNome: espaco.nome,
          quantidade: reservasEspaco.length,
          reservas: reservasEspaco
        });
      }
    });

    this.festasHoje.set(festasHoje);
  }

  // Função para navegar para cadastro de espaços
  navegarParaEspacos() {
    this.router.navigate(['/cadastro-espaco']);
  }

  // Função para navegar para tipos de contrato
  navegarParaTiposContrato() {
    this.router.navigate(['/cadastro-tipo-contrato']);
  }

  // Função para navegar para gestão de reservas
  navegarParaReservas() {
    this.router.navigate(['/lista-reservas']);
  }


  // Métodos para festas do dia
  getFestasHoje(): FestaHoje[] {
    return this.festasHoje();
  }

  async abrirModalFesta(festa: FestaHoje) {
    this.festaSelecionada.set(festa);
    this.modalFestaAberto.set(true);
  }

  fecharModalFesta() {
    this.modalFestaAberto.set(false);
    this.festaSelecionada.set(null);
  }

  // Métodos de formatação
  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}

// Interface para festas do dia
interface FestaHoje {
  espacoId: number;
  espacoNome: string;
  quantidade: number;
  reservas: Reserva[];
}
