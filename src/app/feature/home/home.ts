import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { RelatorioService } from '../../services/relatorio.service';

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
  relatoriosCount = signal<number>(0);
  loading = signal<boolean>(true);

  constructor(
    private router: Router,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    this.loading.set(true);
    try {
      // Carregar dados em paralelo
      const [espacos, tiposContrato, relatorios] = await Promise.all([
        this.espacoService.listarEspacos().toPromise(),
        this.tipoContratoService.listarTiposContrato().toPromise(),
        this.relatorioService.listarRelatorios().toPromise()
      ]);

      // Atualizar os contadores
      this.espacosCount.set(espacos?.length || 0);
      this.tiposContratoCount.set(tiposContrato?.length || 0);
      this.relatoriosCount.set(relatorios?.length || 0);

      console.log('Dados carregados:', {
        espacos: this.espacosCount(),
        tiposContrato: this.tiposContratoCount(),
        relatorios: this.relatoriosCount()
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, manter valores padrão
      this.espacosCount.set(0);
      this.tiposContratoCount.set(0);
      this.relatoriosCount.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  // Função para navegar para cadastro de espaços
  navegarParaEspacos() {
    this.router.navigate(['/cadastro-espaco']);
  }

  // Função para navegar para tipos de contrato
  navegarParaTiposContrato() {
    this.router.navigate(['/cadastro-tipo-contrato']);
  }

  // Função para navegar para geração de relatórios
  navegarParaRelatorios() {
    this.router.navigate(['/gerar-relatorio']);
  }
}
