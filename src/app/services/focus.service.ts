import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusService {

  private hasUserInteracted = false;

  constructor() {
    // Detectar interação do usuário para iOS
    this.setupUserInteractionDetection();
  }

  /**
   * Detecta se o dispositivo é iOS
   */
  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  /**
   * Configura detecção de interação do usuário
   */
  private setupUserInteractionDetection(): void {
    if (this.isIOS()) {
      const onTouchStart = () => {
        this.hasUserInteracted = true;
        document.removeEventListener('touchstart', onTouchStart);
      };
      document.addEventListener('touchstart', onTouchStart);
    }
  }

  /**
   * Foca em um elemento, com tratamento especial para iOS
   */
  focusElement(elementId: string): void {
    const element = document.getElementById(elementId) as HTMLElement;

    if (!element) {
      console.warn(`Elemento com ID '${elementId}' não encontrado`);
      return;
    }

    if (this.isIOS() && !this.hasUserInteracted) {
      // No iOS, antes da primeira interação, usar foco "fake"
      this.fakeFocus(element);
    } else {
      // Foco real para outros dispositivos ou após interação no iOS
      this.realFocus(element);
    }
  }

  /**
   * Aplica foco real no elemento
   */
  private realFocus(element: HTMLElement): void {
    element.focus();
    this.scrollToElement(element);
  }

  /**
   * Aplica foco "fake" no elemento (para iOS antes da interação)
   */
  private fakeFocus(element: HTMLElement): void {
    // Adicionar classe de foco visual
    element.classList.add('ios-fake-focus');

    // Remover a classe quando o elemento perder o foco real
    const onBlur = () => {
      element.classList.remove('ios-fake-focus');
      element.removeEventListener('blur', onBlur);
    };
    element.addEventListener('blur', onBlur);

    // Rolar para o elemento
    this.scrollToElement(element);
  }

  /**
   * Rola suavemente para o elemento
   */
  private scrollToElement(element: HTMLElement): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }

  /**
   * Foca no primeiro campo de um formulário
   */
  focusFirstFormField(formId?: string): void {
    let firstField: HTMLElement | null = null;

    if (formId) {
      const form = document.getElementById(formId);
      if (form) {
        firstField = form.querySelector('input, select, textarea') as HTMLElement;
      }
    } else {
      // Buscar o primeiro input/select/textarea da página
      firstField = document.querySelector('input, select, textarea') as HTMLElement;
    }

    if (firstField && firstField.id) {
      this.focusElement(firstField.id);
    }
  }
}
