import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspacoService } from '../../services/espaco.service';
import { FileService } from '../../services/file.service';
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

  // Formulário
  novoEspaco: Espaco = {
    nome: '',
    logoUrl: ''
  };

  selectedFile: File | null = null;

  constructor(
    private espacoService: EspacoService,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.carregarEspacos();
  }

  async carregarEspacos() {
    this.loading.set(true);
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
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
      console.log('Iniciando salvamento do espaço:', this.novoEspaco);

      // Se há um arquivo selecionado, fazer upload primeiro
      if (this.selectedFile) {
        console.log('Fazendo upload do arquivo:', this.selectedFile.name);
        const fileUrl = await this.fileService.uploadFile(this.selectedFile).toPromise();
        console.log('URL do arquivo recebida:', fileUrl);
        this.novoEspaco.logoUrl = fileUrl!;
      }

      console.log('Enviando espaço para o backend:', this.novoEspaco);
      const espacoSalvo = await this.espacoService.criarEspaco(this.novoEspaco).toPromise();
      console.log('Espaço salvo com sucesso:', espacoSalvo);

      this.espacos.set([...this.espacos(), espacoSalvo!]);

      // Limpar formulário
      this.novoEspaco = {
        nome: '',
        logoUrl: ''
      };
      this.selectedFile = null;

      console.log('Espaço cadastrado com sucesso!');
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
        console.log('FileReader carregado, definindo logoUrl para preview');
        this.novoEspaco.logoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Nenhum arquivo selecionado');
    }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
