import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { FocusService } from '../../services/focus.service';
import { EspacoSelecionadoService } from '../../services/espaco-selecionado.service';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-cadastro-tipo-contrato',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-tipo-contrato.html',
  styleUrl: './cadastro-tipo-contrato.scss'
})
export class CadastroTipoContrato implements OnInit {

  tiposContrato = signal<TipoContrato[]>([]);
  loading = signal<boolean>(false);
  salvando = signal<boolean>(false);
  editando = signal<boolean>(false);

  // Formulário
  novoTipoContrato: TipoContrato = {
    espacoId: 0,
    tipo: 'CONTRATO',
    titulo: '',
    descricao: '',
    textoTemplate: ''
  };

  tipoContratoOriginal: TipoContrato | null = null;

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
    private tipoContratoService: TipoContratoService,
    private focusService: FocusService,
    private espacoSelecionadoService: EspacoSelecionadoService
  ) {}

  ngOnInit() {
    this.carregarTiposContrato();
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
    const espacoSelecionado = this.espacoSelecionadoService.getEspacoSelecionado();
    if (!espacoSelecionado) {
      alert('Por favor, selecione um espaço na página inicial.');
      return;
    }

    // Usar o espaço selecionado globalmente
    this.novoTipoContrato.espacoId = espacoSelecionado.id!;

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
      if (this.editando()) {
        // Modo de edição
        console.log('Iniciando atualização do tipo de contrato:', this.novoTipoContrato.titulo);

        const tipoContratoAtualizado = await this.tipoContratoService.atualizarTipoContrato(
          this.novoTipoContrato.id!,
          this.novoTipoContrato
        ).toPromise();

        console.log('Tipo de contrato atualizado com sucesso:', tipoContratoAtualizado);

        // Atualizar a lista
        this.tiposContrato.set(this.tiposContrato().map(tc =>
          tc.id === this.novoTipoContrato.id ? tipoContratoAtualizado! : tc
        ));

        console.log('Tipo de contrato atualizado com sucesso!');
      } else {
        // Modo de criação
        const tipoContratoSalvo = await this.tipoContratoService.criarTipoContrato(this.novoTipoContrato).toPromise();
        this.tiposContrato.set([...this.tiposContrato(), tipoContratoSalvo!]);

        console.log('Tipo de contrato cadastrado com sucesso!');
      }

      // Limpar formulário
      this.limparFormulario();

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
    const espacoSelecionado = this.espacoSelecionadoService.getEspacoSelecionado();
    if (espacoSelecionado && espacoSelecionado.id === espacoId) {
      return espacoSelecionado.nome;
    }
    return 'Espaço não encontrado';
  }

  // Método para editar tipo de contrato
  editarTipoContrato(tipoContrato: TipoContrato) {
    console.log('Editando tipo de contrato:', tipoContrato);

    // Salvar o tipo de contrato original para possível cancelamento
    this.tipoContratoOriginal = { ...tipoContrato };

    // Preencher o formulário com os dados do tipo de contrato
    this.novoTipoContrato = {
      id: tipoContrato.id,
      espacoId: tipoContrato.espacoId,
      tipo: tipoContrato.tipo,
      titulo: tipoContrato.titulo,
      descricao: tipoContrato.descricao || '',
      textoTemplate: tipoContrato.textoTemplate
    };

    this.editando.set(true);

    // Focar no primeiro campo após um pequeno delay para garantir que o DOM foi atualizado
    setTimeout(() => {
      this.focarPrimeiroCampo();
    }, 100);
  }

  // Método para cancelar edição
  cancelarEdicao() {
    console.log('Cancelando edição');
    this.limparFormulario();
    this.editando.set(false);
    this.tipoContratoOriginal = null;
  }

  // Método para limpar formulário
  private limparFormulario() {
    const espacoSelecionado = this.espacoSelecionadoService.getEspacoSelecionado();
    this.novoTipoContrato = {
      espacoId: espacoSelecionado?.id || 0,
      tipo: 'CONTRATO',
      titulo: '',
      descricao: '',
      textoTemplate: ''
    };
    this.editando.set(false);
    this.tipoContratoOriginal = null;
  }

  // Método para focar no primeiro campo do formulário
  private focarPrimeiroCampo() {
    this.focusService.focusElement('tipo');
  }

  // Métodos para acessar o espaço selecionado no template
  getEspacoSelecionado() {
    return this.espacoSelecionadoService.getEspacoSelecionado();
  }

  temEspacoSelecionado() {
    return this.espacoSelecionadoService.temEspacoSelecionado();
  }
}
