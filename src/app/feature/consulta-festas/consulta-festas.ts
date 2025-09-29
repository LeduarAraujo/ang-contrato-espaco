import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { EspacoService } from '../../services/espaco.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { EspacoSelecionadoService } from '../../services/espaco-selecionado.service';
import { Reserva } from '../../models/reserva.model';
import { Espaco } from '../../models/espaco.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-consulta-festas',
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-festas.html',
  styleUrls: ['./consulta-festas.scss', '../../styles/espaco-selecionado.scss']
})
export class ConsultaFestas implements OnInit {

  reservas = signal<Reserva[]>([]);
  espacos = signal<Espaco[]>([]);
  tiposContrato = signal<TipoContrato[]>([]);
  loading = signal<boolean>(false);
  reservaExpandida = signal<number | null>(null);

  // Estados das seções
  mostrarFestasSemana = signal<boolean>(false);
  mostrarDatasDisponiveis = signal<boolean>(false);
  mostrarConsultaData = signal<boolean>(false);

  // Filtros para datas disponíveis
  dataInicio = signal<string>('');
  dataFim = signal<string>('');
  tipoDias = signal<'todos' | 'finais' | 'dias-semana'>('todos');

  // Consulta de data específica
  dataConsulta = signal<string>('');
  reservaEncontrada = signal<Reserva | null>(null);
  loadingConsulta = signal<boolean>(false);

  // Modal de datas
  mostrarModalDatas = signal<boolean>(false);

  constructor(
    private reservaService: ReservaService,
    private espacoService: EspacoService,
    private tipoContratoService: TipoContratoService,
    private espacoSelecionadoService: EspacoSelecionadoService
  ) {}

  ngOnInit() {
    this.carregarReservas();
    this.carregarEspacos();
    this.carregarTiposContrato();
  }

  async carregarReservas() {
    this.loading.set(true);
    try {
      const reservas = await this.reservaService.listarReservas().toPromise();
      this.reservas.set(reservas || []);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      this.loading.set(false);
    }
  }


  async carregarEspacos() {
    try {
      const espacos = await this.espacoService.listarEspacos().toPromise();
      this.espacos.set(espacos || []);
    } catch (error) {
      console.error('Erro ao carregar espaços:', error);
    }
  }

  async carregarTiposContrato() {
    try {
      const tiposContrato = await this.tipoContratoService.listarTiposContrato().toPromise();
      this.tiposContrato.set(tiposContrato || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de contrato:', error);
    }
  }

  getEspacoSelecionado(): Espaco | null {
    return this.espacoSelecionadoService.getEspacoSelecionado();
  }

  getLogoPreview(espaco: Espaco): string | null {
    // Se tem logoData (base64), usar ele
    if (espaco.logoData && espaco.logoMimeType) {
      return `data:${espaco.logoMimeType};base64,${espaco.logoData}`;
    }
    // Senão, usar logoUrl se existir
    return espaco.logoUrl || null;
  }

  // Método removido - não mais necessário na nova estrutura

  filtrarFestasDaSemana(reservas: Reserva[]): Reserva[] {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // 0=domingo, 1=segunda, ..., 6=sábado

    // Lógica específica:
    // - Se hoje é domingo (0): mostra PRÓXIMA semana (segunda até domingo)
    // - Se hoje é sexta (5) ou sábado (6): mostra PRÓXIMA semana
    // - Se hoje é segunda (1) a quinta (4): mostra semana ATUAL
    const mostrarProximaSemana = diaDaSemana === 0 || diaDaSemana >= 5;

    // Calcular início da semana atual (segunda-feira)
    const diasParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
    let inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() + diasParaSegunda);
    inicioSemana.setHours(0, 0, 0, 0);

    // Se deve mostrar próxima semana, adicionar 7 dias
    if (mostrarProximaSemana) {
      inicioSemana.setDate(inicioSemana.getDate() + 7);
    }

    // Calcular fim da semana (domingo)
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6); // Domingo
    fimSemana.setHours(23, 59, 59, 999);

    return reservas.filter(reserva => {
      const dataFesta = new Date(reserva.dataFesta + 'T00:00:00'); // Forçar timezone local
      return dataFesta >= inicioSemana && dataFesta <= fimSemana;
    });
  }

  formatarDataComDiaSemana(data: string): string {
    if (!data) return '';

    const dataObj = new Date(data + 'T00:00:00');
    const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    const dataFormatada = dataObj.toLocaleDateString('pt-BR');

    // Capitaliza a primeira letra do dia da semana
    const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

    return `${dataFormatada} (${diaSemanaCapitalizado})`;
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarCPF(cpf: string): string {
    // Remove todos os caracteres não numéricos
    const numeros = cpf.replace(/\D/g, '');

    // Aplica máscara baseada no tamanho
    if (numeros.length <= 11) {
      // CPF: 000.000.000-00
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  }

  alternarDetalhes(id: number) {
    if (this.reservaExpandida() === id) {
      this.reservaExpandida.set(null);
    } else {
      this.reservaExpandida.set(id);
    }
  }

  getStatusPagamento(reserva: Reserva): string {
    return reserva.valorIntegral ? 'Integral' : 'Parcial';
  }

  getStatusPagamentoClass(reserva: Reserva): string {
    return reserva.valorIntegral ? 'integral' : 'parcial';
  }

  // Métodos para caixas de texto das festas da semana
  getFestasPorEspaco(): { espaco: Espaco, festas: Reserva[] }[] {
    const festasDaSemana = this.filtrarFestasDaSemana(this.reservas());
    const festasPorEspaco: { [key: number]: Reserva[] } = {};

    // Agrupar festas por espaço
    festasDaSemana.forEach(reserva => {
      const espacoId = reserva.espacoId;
      if (!festasPorEspaco[espacoId]) {
        festasPorEspaco[espacoId] = [];
      }
      festasPorEspaco[espacoId].push(reserva);
    });

    // Converter para array e ordenar por data
    return Object.keys(festasPorEspaco).map(espacoId => {
      const espaco = this.espacos().find(e => e.id === parseInt(espacoId));
      const festas = festasPorEspaco[parseInt(espacoId)].sort((a, b) =>
        new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime()
      );
      return { espaco: espaco!, festas };
    }).filter(item => item.espaco); // Filtrar espaços não encontrados
  }

  gerarTextoFestas(espaco: Espaco, festas: Reserva[]): string {
    let texto = `FESTAS DA SEMANA - ${espaco.nome.toUpperCase()}\n`;
    texto += `${'='.repeat(50)}\n\n`;

    festas.forEach((reserva, index) => {
      const statusPagamento = reserva.valorIntegral ? 'INTEGRAL' : 'PARCIAL';

      texto += `${index + 1}. ${reserva.nomeCliente}\n`;
      texto += `   Data: ${this.formatarDataComDiaSemana(reserva.dataFesta)}\n`;
      texto += `   Horário: ${reserva.horaInicio} às ${reserva.horaFim}\n`;
      texto += `   Telefone: ${reserva.telefoneCliente}\n`;
      texto += `   Valor: R$ ${reserva.valorPagamento.toFixed(2)}\n`;
      texto += `   Pagamento: ${statusPagamento}\n`;
      if (reserva.valorRestante && reserva.valorRestante > 0) {
        texto += `   Restante: R$ ${reserva.valorRestante.toFixed(2)}\n`;
      }
      texto += `\n`;
    });

    return texto;
  }

  async copiarTexto(espaco: Espaco, festas: Reserva[]) {
    const texto = this.gerarTextoFestas(espaco, festas);

    try {
      await navigator.clipboard.writeText(texto);
      console.log('Texto copiado para a área de transferência!');
      // Aqui você pode adicionar uma notificação visual se quiser
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      // Fallback para navegadores mais antigos
      this.copiarTextoFallback(texto);
    }
  }

  private copiarTextoFallback(texto: string) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Texto copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
    }
    document.body.removeChild(textArea);
  }

  // Método removido - não mais necessário na nova estrutura

  // Métodos para datas disponíveis
  abrirModalDatas() {
    // Definir datas padrão (próximos 30 dias)
    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setDate(hoje.getDate() + 30);

    this.dataInicio.set(hoje.toISOString().split('T')[0]);
    this.dataFim.set(dataFim.toISOString().split('T')[0]);
    this.tipoDias.set('todos');
    this.mostrarModalDatas.set(true);
  }

  fecharModalDatas() {
    this.mostrarModalDatas.set(false);
  }


  getDatasDisponiveisPorEspaco(): { espaco: Espaco, datas: string[] }[] {
    if (!this.dataInicio() || !this.dataFim()) {
      return [];
    }

    const datasDisponiveis: { [key: number]: string[] } = {};
    const espacos = this.espacos();

    // Inicializar array de datas para cada espaço
    espacos.forEach(espaco => {
      datasDisponiveis[espaco.id!] = [];
    });

    // Gerar todas as datas no período
    const dataInicio = new Date(this.dataInicio());
    const dataFim = new Date(this.dataFim());
    const todasAsDatas: string[] = [];

    for (let data = new Date(dataInicio); data <= dataFim; data.setDate(data.getDate() + 1)) {
      const dataStr = data.toISOString().split('T')[0];
      todasAsDatas.push(dataStr);
    }

    // Filtrar datas por tipo de dia
    const datasFiltradas = this.filtrarDatasPorTipo(todasAsDatas);

    // Para cada espaço, verificar quais datas não têm festas
    espacos.forEach(espaco => {
      datasFiltradas.forEach(data => {
        const temFesta = this.reservas().some(reserva =>
          reserva.dataFesta === data && reserva.espacoId === espaco.id
        );

        if (!temFesta) {
          datasDisponiveis[espaco.id!].push(data);
        }
      });
    });

    // Converter para array e filtrar espaços com datas disponíveis
    return Object.keys(datasDisponiveis).map(espacoId => {
      const espaco = espacos.find(e => e.id === parseInt(espacoId));
      const datas = datasDisponiveis[parseInt(espacoId)];
      return { espaco: espaco!, datas };
    }).filter(item => item.espaco && item.datas.length > 0);
  }

  filtrarDatasPorTipo(datas: string[]): string[] {
    const tipo = this.tipoDias();

    if (tipo === 'todos') {
      return datas;
    }

    return datas.filter(data => {
      const dataObj = new Date(data + 'T00:00:00');
      const diaSemana = dataObj.getDay(); // 0=domingo, 1=segunda, ..., 6=sábado

      if (tipo === 'finais') {
        return diaSemana === 0 || diaSemana === 6; // Domingo ou sábado
      } else if (tipo === 'dias-semana') {
        return diaSemana >= 1 && diaSemana <= 5; // Segunda a sexta
      }

      return true;
    });
  }

  gerarTextoDatasDisponiveis(espaco: Espaco, datas: string[]): string {
    let texto = `DATAS DISPONÍVEIS - ${espaco.nome.toUpperCase()}\n`;
    texto += `${'='.repeat(50)}\n\n`;

    if (datas.length === 0) {
      texto += 'Nenhuma data disponível no período selecionado.\n';
      return texto;
    }

    // Agrupar datas por mês
    const datasPorMes: { [key: string]: string[] } = {};

    datas.forEach(data => {
      const dataObj = new Date(data + 'T00:00:00');
      const mesAno = `${dataObj.getMonth() + 1}/${dataObj.getFullYear()}`;

      if (!datasPorMes[mesAno]) {
        datasPorMes[mesAno] = [];
      }
      datasPorMes[mesAno].push(data);
    });

    // Ordenar meses
    const mesesOrdenados = Object.keys(datasPorMes).sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      return anoA - anoB || mesA - mesB;
    });

    mesesOrdenados.forEach(mesAno => {
      const datasDoMes = datasPorMes[mesAno].sort();

      datasDoMes.forEach(data => {
        const dataObj = new Date(data + 'T00:00:00');
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        texto += `${dia}/${mes}\n`;
      });
    });

    return texto;
  }

  async copiarTextoDatas(espaco: Espaco, datas: string[]) {
    const texto = this.gerarTextoDatasDisponiveis(espaco, datas);

    try {
      await navigator.clipboard.writeText(texto);
      console.log('Datas copiadas para a área de transferência!');
      alert('Datas copiadas para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      this.copiarTextoFallback(texto);
      alert('Datas copiadas para a área de transferência!');
    }
  }

  // Métodos de filtro
  filtrarPorEspaco(reservas: Reserva[], espacoId: number): Reserva[] {
    return reservas.filter(reserva => {
      return reserva.espacoId === espacoId;
    });
  }

  filtrarPorMes(reservas: Reserva[], mesAno: string): Reserva[] {
    const [mes, ano] = mesAno.split('/').map(Number);
    return reservas.filter(reserva => {
      const dataFesta = new Date(reserva.dataFesta);
      return dataFesta.getMonth() + 1 === mes && dataFesta.getFullYear() === ano;
    });
  }

  filtrarPorPagamento(reservas: Reserva[], tipoPagamento: string): Reserva[] {
    return reservas.filter(reserva => {
      if (tipoPagamento === 'integral') {
        return reserva.valorIntegral;
      } else if (tipoPagamento === 'parcial') {
        return !reserva.valorIntegral;
      }
      return true;
    });
  }

  // Métodos removidos - não mais necessários na nova estrutura

  // Método para obter nome do espaço
  getNomeEspaco(reserva: Reserva): string {
    const espaco = this.espacos().find(e => e.id === reserva.espacoId);
    return espaco ? espaco.nome : 'Espaço não encontrado';
  }

  // Método para obter opções de mês
  getOpcoesMes(): string[] {
    const meses: string[] = [];
    const reservas = this.reservas();

    reservas.forEach(reserva => {
      const dataFesta = new Date(reserva.dataFesta);
      const mesAno = `${dataFesta.getMonth() + 1}/${dataFesta.getFullYear()}`;
      if (!meses.includes(mesAno)) {
        meses.push(mesAno);
      }
    });

    return meses.sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      return anoA - anoB || mesA - mesB;
    });
  }

  // Método para formatar mês para exibição
  formatarMes(mesAno: string): string {
    const [mes, ano] = mesAno.split('/').map(Number);
    const nomesMeses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${nomesMeses[mes - 1]} ${ano}`;
  }

  // Métodos para controle das seções
  alternarFestasSemana() {
    const novoEstado = !this.mostrarFestasSemana();
    this.mostrarFestasSemana.set(novoEstado);

    // Se está abrindo, fecha as outras seções
    if (novoEstado) {
      this.mostrarDatasDisponiveis.set(false);
      this.mostrarConsultaData.set(false);
    }
  }

  alternarDatasDisponiveis() {
    const novoEstado = !this.mostrarDatasDisponiveis();
    this.mostrarDatasDisponiveis.set(novoEstado);

    // Se está abrindo, fecha as outras seções
    if (novoEstado) {
      this.mostrarFestasSemana.set(false);
      this.mostrarConsultaData.set(false);
    }
  }

  alternarConsultaData() {
    const novoEstado = !this.mostrarConsultaData();
    this.mostrarConsultaData.set(novoEstado);

    // Se está abrindo, fecha as outras seções
    if (novoEstado) {
      this.mostrarFestasSemana.set(false);
      this.mostrarDatasDisponiveis.set(false);
    }
  }

  // Consultar data específica
  async consultarData() {
    if (!this.dataConsulta() || !this.getEspacoSelecionado()) {
      alert('Por favor, selecione uma data e um espaço.');
      return;
    }

    this.loadingConsulta.set(true);
    this.reservaEncontrada.set(null);

    try {
      // Buscar reservas por período (um dia)
      const reservas = await this.reservaService.buscarReservasPorPeriodo(
        this.dataConsulta(),
        this.dataConsulta()
      ).toPromise();

      // Filtrar pela data e espaço específicos
      const reserva = reservas?.find(r =>
        r.dataFesta === this.dataConsulta() &&
        r.espacoId === this.getEspacoSelecionado()!.id
      );

      this.reservaEncontrada.set(reserva || null);

      if (!reserva) {
        console.log('Nenhuma reserva encontrada para a data e espaço selecionados.');
      }
    } catch (error) {
      console.error('Erro ao consultar data:', error);
      alert('Erro ao consultar a data. Tente novamente.');
    } finally {
      this.loadingConsulta.set(false);
    }
  }

  // Obter festas da semana por espaço selecionado
  getFestasSemanaPorEspaco(): Reserva[] {
    const espacoSelecionado = this.getEspacoSelecionado();
    if (!espacoSelecionado) {
      return [];
    }

    const festasDaSemana = this.filtrarFestasDaSemana(this.reservas());
    return festasDaSemana.filter(reserva =>
      reserva.espacoId === espacoSelecionado.id
    );
  }

  // Obter datas disponíveis por espaço selecionado
  getDatasDisponiveisPorEspacoSelecionado(): string[] {
    if (!this.getEspacoSelecionado()) {
      return [];
    }

    const todasAsDatasArray = this.getDatasDisponiveisPorEspaco();
    const todasAsDatas = todasAsDatasArray
      .find(item => item.espaco.id === this.getEspacoSelecionado()!.id);

    return todasAsDatas?.datas || [];
  }

  // Obter nome do espaço por ID
  getNomeEspacoPorId(espacoId: number): string {
    const espaco = this.espacos().find(e => e.id === espacoId);
    return espaco ? espaco.nome : 'Espaço não encontrado';
  }

  getNomeEspacoSelecionado(): string {
    const espacoSelecionado = this.getEspacoSelecionado();
    return espacoSelecionado ? espacoSelecionado.nome : 'Espaço não encontrado';
  }

  // Métodos auxiliares para o template

  copiarFestasSemana() {
    // Simplesmente copia as festas que estão sendo exibidas no grid
    const festas = this.getFestasSemanaPorEspaco();

    if (festas.length === 0) {
      // Se não há festas, copia uma mensagem informativa
      this.copiarTextoSimples('Nenhuma festa encontrada para esta semana.');
      return;
    }

    // Gera texto simples com as festas
    let texto = 'FESTAS DA SEMANA\n';
    texto += '='.repeat(20) + '\n\n';

    festas.forEach(festa => {
      const dataFormatada = new Date(festa.dataFesta + 'T00:00:00');
      const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dataFormatada.getDay()];
      texto += `${dataFormatada.toLocaleDateString('pt-BR')} (${diaSemana})\n`;
      texto += `Cliente: ${festa.nomeCliente}\n`;
      texto += `Horário: ${festa.horaInicio} às ${festa.horaFim}\n`;
      texto += `Telefone: ${festa.telefoneCliente}\n`;
      texto += `Valor: R$ ${festa.valorPagamento.toFixed(2)}\n`;
      texto += `Pagamento: ${festa.valorIntegral ? 'Integral' : 'Parcial'}\n`;
      texto += '-'.repeat(30) + '\n\n';
    });

    texto += `Total: ${festas.length} festa(s) agendada(s)`;

    this.copiarTextoSimples(texto);
  }

  copiarDatasDisponiveis() {
    // Simplesmente copia as datas que estão sendo exibidas no grid
    const datas = this.getDatasDisponiveisPorEspacoSelecionado();

    if (datas.length === 0) {
      // Se não há datas, copia uma mensagem informativa
      this.copiarTextoSimples('Nenhuma data disponível no período selecionado.');
      return;
    }

    // Gera texto simples com as datas
    let texto = 'DATAS DISPONÍVEIS\n';
    texto += '='.repeat(20) + '\n\n';

    datas.forEach(data => {
      const dataFormatada = new Date(data + 'T00:00:00');
      const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dataFormatada.getDay()];
      texto += `${dataFormatada.toLocaleDateString('pt-BR')} (${diaSemana})\n`;
    });

    texto += `\nTotal: ${datas.length} data(s) disponível(is)`;

    this.copiarTextoSimples(texto);
  }

  // Função simples para copiar texto
  async copiarTextoSimples(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      console.log('Texto copiado para a área de transferência!');
      alert('Datas copiadas para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      this.copiarTextoFallback(texto);
      alert('Datas copiadas para a área de transferência!');
    }
  }
}
