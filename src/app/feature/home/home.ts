import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { ReservaService } from '../../services/reserva.service';
import { EspacoSelecionadoService } from '../../services/espaco-selecionado.service';
import { Reserva } from '../../models/reserva.model';
import { Espaco } from '../../models/espaco.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss', './home-modal.scss']
})
export class Home implements OnInit {
  // Signals para os dados reais
  tiposContratoCount = signal<number>(0);
  loading = signal<boolean>(true);

  // Signals para espaços
  espacos = signal<Espaco[]>([]);
  espacosLoading = signal<boolean>(true);

  // Signals para festas do dia
  festasHoje = signal<FestaHoje[]>([]);
  modalFestaAberto = signal<boolean>(false);
  festaSelecionada = signal<FestaHoje | null>(null);

  constructor(
    private router: Router,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService,
    private reservaService: ReservaService,
    private espacoSelecionadoService: EspacoSelecionadoService
  ) {}

  ngOnInit() {
    this.carregarDados();
    this.carregarEspacos();
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
      this.tiposContratoCount.set(tiposContrato?.length || 0);

      // Carregar festas do dia
      await this.carregarFestasHoje(reservas || [], espacos || []);

      console.log('Dados carregados:', {
        tiposContrato: this.tiposContratoCount()
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, manter valores padrão
      this.tiposContratoCount.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  async carregarEspacos() {
    this.espacosLoading.set(true);
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
      this.espacos.set([]);
    } finally {
      this.espacosLoading.set(false);
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

  // Função para selecionar um espaço
  selecionarEspaco(espaco: Espaco) {
    this.espacoSelecionadoService.selecionarEspaco(espaco);
    console.log('Espaço selecionado:', espaco.nome);
  }

  // Função para obter o espaço selecionado
  getEspacoSelecionado(): Espaco | null {
    return this.espacoSelecionadoService.getEspacoSelecionado();
  }

  // Função para verificar se um espaço está selecionado
  isEspacoSelecionado(espaco: Espaco): boolean {
    const espacoSelecionado = this.getEspacoSelecionado();
    return espacoSelecionado?.id === espaco.id;
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

  getLogoPreview(espaco: Espaco): string | null {
    // Se tem logoData (base64), usar ele
    if (espaco.logoData && espaco.logoMimeType) {
      return `data:${espaco.logoMimeType};base64,${espaco.logoData}`;
    }
    // Senão, usar logoUrl se existir
    return espaco.logoUrl || null;
  }
}

// Interface para festas do dia
interface FestaHoje {
  espacoId: number;
  espacoNome: string;
  quantidade: number;
  reservas: Reserva[];
}
