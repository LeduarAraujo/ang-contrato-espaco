import { Injectable, signal } from '@angular/core';
import { Espaco } from '../models/espaco.model';

@Injectable({
  providedIn: 'root'
})
export class EspacoSelecionadoService {
  // Signal para armazenar o espaço selecionado
  private espacoSelecionado = signal<Espaco | null>(null);

  constructor() {
    // Tentar carregar espaço selecionado do localStorage na inicialização
    this.carregarEspacoDoLocalStorage();
  }

  /**
   * Define o espaço selecionado
   */
  selecionarEspaco(espaco: Espaco): void {
    this.espacoSelecionado.set(espaco);
    this.salvarEspacoNoLocalStorage(espaco);
  }

  /**
   * Retorna o espaço atualmente selecionado
   */
  getEspacoSelecionado(): Espaco | null {
    return this.espacoSelecionado();
  }

  /**
   * Retorna o signal do espaço selecionado para reatividade
   */
  getEspacoSelecionadoSignal() {
    return this.espacoSelecionado;
  }

  /**
   * Limpa o espaço selecionado
   */
  limparEspacoSelecionado(): void {
    this.espacoSelecionado.set(null);
    this.removerEspacoDoLocalStorage();
  }

  /**
   * Verifica se há um espaço selecionado
   */
  temEspacoSelecionado(): boolean {
    return this.espacoSelecionado() !== null;
  }

  /**
   * Retorna o ID do espaço selecionado
   */
  getEspacoId(): number | null {
    const espaco = this.espacoSelecionado();
    return espaco?.id || null;
  }

  /**
   * Retorna o nome do espaço selecionado
   */
  getEspacoNome(): string | null {
    const espaco = this.espacoSelecionado();
    return espaco?.nome || null;
  }

  /**
   * Retorna a URL do logo do espaço selecionado
   */
  getEspacoLogoUrl(): string | null {
    const espaco = this.espacoSelecionado();
    return espaco?.logoUrl || null;
  }

  /**
   * Retorna os dados base64 do logo do espaço selecionado
   */
  getEspacoLogoData(): string | null {
    const espaco = this.espacoSelecionado();
    return espaco?.logoData || null;
  }

  /**
   * Verifica se estamos no navegador
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Salva o espaço selecionado no localStorage
   */
  private salvarEspacoNoLocalStorage(espaco: Espaco): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.setItem('espacoSelecionado', JSON.stringify(espaco));
    } catch (error) {
      console.error('Erro ao salvar espaço no localStorage:', error);
    }
  }

  /**
   * Carrega o espaço selecionado do localStorage
   */
  private carregarEspacoDoLocalStorage(): void {
    if (!this.isBrowser()) return;

    try {
      const espacoSalvo = localStorage.getItem('espacoSelecionado');
      if (espacoSalvo) {
        const espaco: Espaco = JSON.parse(espacoSalvo);
        this.espacoSelecionado.set(espaco);
      }
    } catch (error) {
      console.error('Erro ao carregar espaço do localStorage:', error);
      this.removerEspacoDoLocalStorage();
    }
  }

  /**
   * Remove o espaço selecionado do localStorage
   */
  private removerEspacoDoLocalStorage(): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.removeItem('espacoSelecionado');
    } catch (error) {
      console.error('Erro ao remover espaço do localStorage:', error);
    }
  }
}
