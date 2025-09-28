import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { EspacoService } from '../../services/espaco.service';
import { Reserva } from '../../models/reserva.model';
import { Espaco } from '../../models/espaco.model';

@Component({
  selector: 'app-cadastro-reserva',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-reserva.html',
  styleUrl: './cadastro-reserva.scss'
})
export class CadastroReserva implements OnInit {

  espacos = signal<Espaco[]>([]);
  loading = signal<boolean>(false);
  salvando = signal<boolean>(false);

  // Modo de edição
  modoEdicao = signal<boolean>(false);
  reservaId = signal<number | null>(null);

  // Formulário
  reserva: Reserva = {
    espacoId: 0,
    nomeCliente: '',
    cpfCliente: '',
    telefoneCliente: '',
    dataFesta: '',
    horaInicio: '',
    horaFim: '',
    valorPagamento: 0,
    valorIntegral: true,
    valorRestante: 0
  };

  // Validação
  erros = signal<{[key: string]: string}>({});

  constructor(
    private reservaService: ReservaService,
    private espacoService: EspacoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.carregarEspacos();

    // Verificar se está em modo de edição
    this.route.queryParams.subscribe(params => {
      if (params['modo'] === 'edicao' && params['id']) {
        this.modoEdicao.set(true);
        this.reservaId.set(+params['id']);
        this.carregarReservaParaEdicao(+params['id']);
      }
    });
  }

  async carregarEspacos() {
    this.loading.set(true);
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async carregarReservaParaEdicao(id: number) {
    this.loading.set(true);
    try {
      const reserva = await this.reservaService.buscarReservaPorId(id).toPromise();
      if (reserva) {
        this.reserva = { ...reserva };
      }
    } catch (error) {
      console.error('Erro ao carregar reserva para edição:', error);
      alert('Erro ao carregar dados da reserva. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }

  formatarCPF(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length <= 11) {
      // CPF: 000.000.000-00
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    this.reserva.cpfCliente = valor;
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length <= 10) {
      // Telefone fixo: (00) 0000-0000
      valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      // Celular: (00) 00000-0000
      valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    this.reserva.telefoneCliente = valor;
  }

  onValorChange(event: any): void {
    const valor = parseFloat(event.target.value) || 0;
    this.reserva.valorPagamento = valor;
  }

  onValorRestanteChange(event: any): void {
    const valor = parseFloat(event.target.value) || 0;
    this.reserva.valorRestante = valor;
  }

  formatarValorPorExtenso(valor: number): string {
    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const dezenasEspeciais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    if (valor === 0) return 'zero reais';
    if (valor < 0) return 'valor inválido';

    let inteiro = Math.floor(valor);
    let decimal = Math.round((valor - inteiro) * 100);

    let resultado = '';

    // Centenas
    if (inteiro >= 100) {
      const centena = Math.floor(inteiro / 100);
      if (centena === 1 && inteiro === 100) {
        resultado += 'cem';
      } else {
        resultado += centenas[centena];
      }
      inteiro = inteiro % 100;
      if (inteiro > 0) resultado += ' e ';
    }

    // Dezenas
    if (inteiro >= 20) {
      const dezena = Math.floor(inteiro / 10);
      resultado += dezenas[dezena];
      inteiro = inteiro % 10;
      if (inteiro > 0) resultado += ' e ';
    } else if (inteiro >= 10) {
      resultado += dezenasEspeciais[inteiro - 10];
      inteiro = 0;
    }

    // Unidades
    if (inteiro > 0) {
      resultado += unidades[inteiro];
    }

    // Plural
    if (inteiro !== 1) {
      resultado += ' reais';
    } else {
      resultado += ' real';
    }

    // Centavos
    if (decimal > 0) {
      resultado += ' e ';
      if (decimal >= 20) {
        const dezenaCent = Math.floor(decimal / 10);
        resultado += dezenas[dezenaCent];
        decimal = decimal % 10;
        if (decimal > 0) resultado += ' e ';
      } else if (decimal >= 10) {
        resultado += dezenasEspeciais[decimal - 10];
        decimal = 0;
      }
      if (decimal > 0) {
        resultado += unidades[decimal];
      }
      if (decimal !== 1) {
        resultado += ' centavos';
      } else {
        resultado += ' centavo';
      }
    }

    return resultado;
  }

  onValorIntegralChange() {
    if (this.reserva.valorIntegral) {
      this.reserva.valorRestante = 0;
    }
  }

  validarFormulario(): boolean {
    const erros: {[key: string]: string} = {};

    if (!this.reserva.espacoId) {
      erros['espacoId'] = 'Selecione um espaço';
    }

    if (!this.reserva.nomeCliente.trim()) {
      erros['nomeCliente'] = 'Nome do cliente é obrigatório';
    }

    if (!this.reserva.cpfCliente.trim()) {
      erros['cpfCliente'] = 'CPF/CNPJ é obrigatório';
    } else {
      const cpfLimpo = this.reserva.cpfCliente.replace(/\D/g, '');
      if (cpfLimpo.length < 11) {
        erros['cpfCliente'] = 'CPF/CNPJ deve ter pelo menos 11 dígitos';
      }
    }

    if (!this.reserva.telefoneCliente.trim()) {
      erros['telefoneCliente'] = 'Telefone é obrigatório';
    }

    if (!this.reserva.dataFesta) {
      erros['dataFesta'] = 'Data da festa é obrigatória';
    } else {
      const dataFesta = new Date(this.reserva.dataFesta);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (dataFesta < hoje) {
        erros['dataFesta'] = 'Data da festa não pode ser no passado';
      }
    }

    if (!this.reserva.horaInicio) {
      erros['horaInicio'] = 'Horário de início é obrigatório';
    }

    if (!this.reserva.horaFim) {
      erros['horaFim'] = 'Horário de fim é obrigatório';
    } else if (this.reserva.horaInicio && this.reserva.horaFim) {
      if (this.reserva.horaFim <= this.reserva.horaInicio) {
        erros['horaFim'] = 'Horário de fim deve ser posterior ao horário de início';
      }
    }

    if (!this.reserva.valorPagamento || this.reserva.valorPagamento <= 0) {
      erros['valorPagamento'] = 'Valor do pagamento deve ser maior que zero';
    }

    if (!this.reserva.valorIntegral) {
      if (!this.reserva.valorRestante || this.reserva.valorRestante <= 0) {
        erros['valorRestante'] = 'Valor restante deve ser maior que zero';
      }
    }

    this.erros.set(erros);
    return Object.keys(erros).length === 0;
  }

  async salvarReserva() {
    if (!this.validarFormulario()) {
      return;
    }

    this.salvando.set(true);
    try {
      if (this.modoEdicao()) {
        // Editar reserva existente
        await this.reservaService.atualizarReserva(this.reservaId()!, this.reserva).toPromise();
        console.log('Reserva atualizada com sucesso!');
      } else {
        // Criar nova reserva
        await this.reservaService.criarReserva(this.reserva).toPromise();
        console.log('Reserva criada com sucesso!');
      }
      this.router.navigate(['/lista-reservas']);
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      alert('Erro ao salvar reserva. Tente novamente.');
    } finally {
      this.salvando.set(false);
    }
  }

  cancelar() {
    this.router.navigate(['/lista-reservas']);
  }

  getValorFormatado(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
