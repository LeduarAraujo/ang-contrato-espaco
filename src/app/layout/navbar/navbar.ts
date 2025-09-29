import { Component, signal, OnInit, effect } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EspacoSelecionadoService } from '../../services/espaco-selecionado.service';
import { EspacoService } from '../../services/espaco.service';
import { Espaco } from '../../models/espaco.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss', './navbar-fix.scss']
})
export class Navbar implements OnInit {
  menuOpen = signal<boolean>(false);
  espacoDropdownOpen = signal<boolean>(false);
  espacos = signal<Espaco[]>([]);
  espacosLoading = signal<boolean>(false);

  constructor(
    private espacoSelecionadoService: EspacoSelecionadoService,
    private espacoService: EspacoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarEspacos();

    // Fechar dropdown quando clicar fora dele (apenas no navegador)
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const espacoSelecionado = document.querySelector('.espaco-selecionado');

        if (espacoSelecionado && !espacoSelecionado.contains(target)) {
          this.espacoDropdownOpen.set(false);
        }
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
    this.espacoDropdownOpen.set(false); // Fechar dropdown quando abrir menu mobile
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleEspacoDropdown(): void {
    this.espacoDropdownOpen.update(open => !open);
    this.menuOpen.set(false); // Fechar menu mobile quando abrir dropdown
  }

  fecharDropdown(): void {
    this.espacoDropdownOpen.set(false);
  }

  getEspacoSelecionado(): Espaco | null {
    return this.espacoSelecionadoService.getEspacoSelecionado();
  }

  temEspacoSelecionado(): boolean {
    return this.espacoSelecionadoService.temEspacoSelecionado();
  }

  irParaHome(): void {
    this.router.navigate(['/home']);
    this.espacoDropdownOpen.set(false);
  }

  irParaCadastroEspaco(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/cadastro-espaco']);
    this.espacoDropdownOpen.set(false);
  }

  async carregarEspacos(): Promise<void> {
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

  selecionarEspaco(espaco: Espaco, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.espacoSelecionadoService.selecionarEspaco(espaco);
    this.espacoDropdownOpen.set(false);
    console.log('Espaço selecionado:', espaco.nome);
  }

  isEspacoSelecionado(espaco: Espaco): boolean {
    const espacoAtual = this.espacoSelecionadoService.getEspacoSelecionado();
    return espacoAtual?.id === espaco.id;
  }

  getLogoPreview(espaco: Espaco): string | null {
    // Se tem logoData (base64), usar ele
    if (espaco.logoData && espaco.logoMimeType) {
      return `data:${espaco.logoMimeType};base64,${espaco.logoData}`;
    }
    // Senão, usar logoUrl se existir
    return espaco.logoUrl || null;
  }

  getEspacoSelecionadoLogoPreview(): string | null {
    const espaco = this.getEspacoSelecionado();
    if (!espaco) return null;
    return this.getLogoPreview(espaco);
  }
}
