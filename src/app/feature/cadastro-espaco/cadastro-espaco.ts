import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspacoService } from '../../services/espaco.service';
import { FocusService } from '../../services/focus.service';
import { Espaco } from '../../models/espaco.model';

@Component({
  selector: 'app-cadastro-espaco',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-espaco.html',
  styleUrl: './cadastro-espaco.scss'
})
export class CadastroEspaco implements OnInit {

  espacos = signal<Espaco[]>([]);
  loading = signal<boolean>(false);
  salvando = signal<boolean>(false);
  editando = signal<boolean>(false);

  // Formulário
  novoEspaco: Espaco = {
    nome: '',
    logoUrl: '',
    nomeProprietario: '',
    cnpjProprietario: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  espacoOriginal: Espaco | null = null;

  constructor(
    private espacoService: EspacoService,
    private focusService: FocusService
  ) {}

  ngOnInit() {
    this.carregarEspacos();
  }

  async carregarEspacos() {
    this.loading.set(true);
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      if (espacos) {
        // As imagens agora são salvas diretamente na pasta assets/temp
        // Não precisamos mais buscar via endpoint
        this.espacos.set(espacos);
      }
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
      console.error('Erro ao carregar espaços. Verifique se o backend está rodando.');
    } finally {
      this.loading.set(false);
    }
  }

  async salvarEspaco() {
    if (!this.novoEspaco.nome.trim()) {
      console.warn('Nome do espaço é obrigatório');
      return;
    }

    this.salvando.set(true);
    try {
      if (this.editando()) {
        // Modo de edição
        console.log('Iniciando atualização do espaço:', this.novoEspaco.nome);

        const espacoAtualizado = await this.espacoService.atualizarEspaco(
          this.novoEspaco.id!,
          this.novoEspaco
        ).toPromise();

        console.log('Espaço atualizado com sucesso:', espacoAtualizado);

        // Atualizar a lista
        this.espacos.set(this.espacos().map(e =>
          e.id === this.novoEspaco.id ? espacoAtualizado! : e
        ));

        console.log('Espaço atualizado com sucesso!');
      } else {
        // Modo de criação
        console.log('Iniciando salvamento do espaço:', this.novoEspaco.nome);
        console.log('Arquivo selecionado:', this.selectedFile?.name || 'nenhum');

        // Usar o novo método que faz upload e cadastro em uma única requisição
        const espacoSalvo = await this.espacoService.criarEspacoComImagem(
          this.novoEspaco.nome,
          this.selectedFile,
          this.novoEspaco.nomeProprietario,
          this.novoEspaco.cnpjProprietario
        ).toPromise();

        console.log('Espaço salvo com sucesso:', espacoSalvo);

        this.espacos.set([...this.espacos(), espacoSalvo!]);

        console.log('Espaço cadastrado com sucesso!');
      }

      // Limpar formulário
      this.limparFormulario();

    } catch (error) {
      console.error('Erro ao salvar espaço:', error);
      console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
    } finally {
      this.salvando.set(false);
    }
  }

  async excluirEspaco(id: number) {
    // No servidor, não há confirm, então apenas executa
    // if (!confirm('Tem certeza que deseja excluir este espaço?')) {
    //   return;
    // }

    try {
      await this.espacoService.excluirEspaco(id).toPromise();
      this.espacos.set(this.espacos().filter(e => e.id !== id));
      console.log('Espaço excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir espaço:', error);
      console.error('Erro ao excluir espaço.');
    }
  }

  onFileSelected(event: any) {
    console.log('onFileSelected chamado:', event);
    const file = event.target.files[0];
    console.log('Arquivo selecionado:', file);

    if (file) {
      console.log('Detalhes do arquivo:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        console.warn('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.warn('O arquivo deve ter no máximo 5MB.');
        return;
      }

      this.selectedFile = file;
      console.log('Arquivo definido como selectedFile:', this.selectedFile);

      // Criar URL temporária para preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('FileReader carregado, definindo imagePreview');
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Nenhum arquivo selecionado');
    }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  removerImagem() {
    this.selectedFile = null;
    this.imagePreview = null;
    console.log('Imagem removida');
  }

  // Método para montar a URL da imagem usando logoMimeType e logoData
  montarUrlImagem(espaco: Espaco): string | null {
    if (espaco.logoData && espaco.logoMimeType) {
      return `data:${espaco.logoMimeType};base64,${espaco.logoData}`;
    }
    return null;
  }

  // Método para editar espaço
  editarEspaco(espaco: Espaco) {
    console.log('Editando espaço:', espaco);

    // Salvar o espaço original para possível cancelamento
    this.espacoOriginal = { ...espaco };

    // Preencher o formulário com os dados do espaço
    this.novoEspaco = {
      id: espaco.id,
      nome: espaco.nome,
      logoUrl: espaco.logoUrl,
      nomeProprietario: espaco.nomeProprietario || '',
      cnpjProprietario: espaco.cnpjProprietario || ''
    };

    // Se o espaço tem logo, mostrar preview
    if (espaco.logoData && espaco.logoMimeType) {
      this.imagePreview = `data:${espaco.logoMimeType};base64,${espaco.logoData}`;
    } else {
      this.imagePreview = null;
    }

    this.selectedFile = null; // Limpar arquivo selecionado
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
    this.espacoOriginal = null;
  }

  // Método para limpar formulário
  private limparFormulario() {
    this.novoEspaco = {
      nome: '',
      logoUrl: '',
      nomeProprietario: '',
      cnpjProprietario: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.editando.set(false);
    this.espacoOriginal = null;
  }

  // Método para focar no primeiro campo do formulário
  private focarPrimeiroCampo() {
    this.focusService.focusElement('nome');
  }
}
