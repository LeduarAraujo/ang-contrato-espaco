import { Routes } from '@angular/router';
import { Home } from './feature/home/home';
import { CadastroEspaco } from './feature/cadastro-espaco/cadastro-espaco';
import { CadastroTipoContrato } from './feature/cadastro-tipo-contrato/cadastro-tipo-contrato';
import { GerarRelatorio } from './feature/gerar-relatorio/gerar-relatorio';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'cadastro-espaco', component: CadastroEspaco },
  { path: 'cadastro-tipo-contrato', component: CadastroTipoContrato },
  { path: 'gerar-relatorio', component: GerarRelatorio },
];
