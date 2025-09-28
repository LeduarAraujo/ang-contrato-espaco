import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  constructor(private router: Router) {}

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
