import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { CadastroEspaco } from './feature/cadastro-espaco/cadastro-espaco';
import { CadastroTipoContrato } from './feature/cadastro-tipo-contrato/cadastro-tipo-contrato';
import { GerarPdf } from './feature/gerar-pdf/gerar-pdf';
import { ConsultaFestas } from './feature/consulta-festas/consulta-festas';
import { ListaReservas } from './feature/lista-reservas/lista-reservas';
import { CadastroReserva } from './feature/cadastro-reserva/cadastro-reserva';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'cadastro-espaco', component: CadastroEspaco },
  { path: 'cadastro-tipo-contrato', component: CadastroTipoContrato },
  { path: 'gerar-pdf', component: GerarPdf },
  { path: 'consulta-festas', component: ConsultaFestas },
  { path: 'lista-reservas', component: ListaReservas },
  { path: 'cadastro-reserva', component: CadastroReserva },
];
