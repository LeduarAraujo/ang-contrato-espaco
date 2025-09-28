import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-cadastro-tipo-contrato',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-tipo-contrato.html',
  styleUrl: './cadastro-tipo-contrato.scss'
})
export class CadastroTipoContrato implements OnInit {

  espacos = signal<Espaco[]>([]);
  tiposContrato = signal<TipoContrato[]>([]);
  loading = signal<boolean>(false);
  salvando = signal<boolean>(false);

  // Formulário
  novoTipoContrato: TipoContrato = {
    espacoId: 0,
    tipo: 'CONTRATO',
    titulo: '',
    textoTemplate: ''
  };

  // Placeholders disponíveis
  placeholders = [
    '{nome}',
    '{cpf}',
    '{valor}',
    '{valorExtenso}',
    '{dataFesta}',
    '{horaInicio}',
    '{horaFim}'
  ];

  constructor(
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService
  ) {}

  ngOnInit() {
    this.carregarEspacos();
    this.carregarTiposContrato();
  }

  async carregarEspacos() {
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
      console.error('Erro ao carregar espaços. Verifique se o backend está rodando.');
    }
  }

  async carregarTiposContrato() {
    this.loading.set(true);
    try {
      const tiposContrato = await this.tipoContratoService.listarTiposContrato().toPromise();
      this.tiposContrato.set(tiposContrato || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de contrato:', error);
      console.error('Erro ao carregar tipos de contrato.');
    } finally {
      this.loading.set(false);
    }
  }

  inserirPlaceholder(placeholder: string) {
    const textarea = document.getElementById('textoTemplate') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this.novoTipoContrato.textoTemplate;

      this.novoTipoContrato.textoTemplate = text.substring(0, start) + placeholder + text.substring(end);

      // Posicionar cursor após o placeholder
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  }

  async salvarTipoContrato() {
    if (!this.novoTipoContrato.espacoId) {
      console.warn('Selecione um espaço');
      return;
    }

    if (!this.novoTipoContrato.titulo.trim()) {
      console.warn('Título é obrigatório');
      return;
    }

    if (!this.novoTipoContrato.textoTemplate.trim()) {
      console.warn('Texto do template é obrigatório');
      return;
    }

    this.salvando.set(true);
    try {
      const tipoContratoSalvo = await this.tipoContratoService.criarTipoContrato(this.novoTipoContrato).toPromise();
      this.tiposContrato.set([...this.tiposContrato(), tipoContratoSalvo!]);

      // Limpar formulário
      this.novoTipoContrato = {
        espacoId: 0,
        tipo: 'CONTRATO',
        titulo: '',
        textoTemplate: ''
      };

      console.log('Tipo de contrato cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar tipo de contrato:', error);
      console.error('Erro ao salvar tipo de contrato. Verifique se já não existe um template para este espaço e tipo.');
    } finally {
      this.salvando.set(false);
    }
  }

  async excluirTipoContrato(id: number) {
    // No servidor, não há confirm, então apenas executa
    // if (!confirm('Tem certeza que deseja excluir este tipo de contrato?')) {
    //   return;
    // }

    try {
      await this.tipoContratoService.excluirTipoContrato(id).toPromise();
      this.tiposContrato.set(this.tiposContrato().filter(tc => tc.id !== id));
      console.log('Tipo de contrato excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir tipo de contrato:', error);
      console.error('Erro ao excluir tipo de contrato.');
    }
  }

  getEspacoNome(espacoId: number): string {
    const espaco = this.espacos().find(e => e.id === espacoId);
    return espaco ? espaco.nome : 'Espaço não encontrado';
  }
}
