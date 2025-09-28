import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { TipoContratoService } from '../../services/tipo-contrato.service';
import { PdfService } from '../../services/pdf.service';
import { Reserva } from '../../models/reserva.model';
import { TipoContrato } from '../../models/tipo-contrato.model';

@Component({
  selector: 'app-gerar-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerar-pdf.html',
  styleUrl: './gerar-pdf.scss'
})
export class GerarPdf implements OnInit {

  reserva = signal<Reserva | null>(null);
  tiposContrato = signal<TipoContrato[]>([]);
  tipoContratoSelecionado = signal<number | null>(null);
  loading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private tipoContratoService: TipoContratoService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['reservaId']) {
        this.carregarReserva(Number(params['reservaId']));
      }
    });
    this.carregarTiposContrato();
  }

  async carregarReserva(id: number) {
    try {
      this.loading.set(true);
      const reserva = await this.reservaService.buscarReservaPorId(id).toPromise();
      this.reserva.set(reserva || null);
    } catch (error) {
      console.error('Erro ao carregar reserva:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async carregarTiposContrato() {
    try {
      const tipos = await this.tipoContratoService.listarTiposContrato().toPromise();
      this.tiposContrato.set(tipos || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de contrato:', error);
    }
  }

  async gerarPdf() {
    if (!this.reserva() || !this.tipoContratoSelecionado()) {
      alert('Por favor, selecione um tipo de contrato.');
      return;
    }

    try {
      this.loading.set(true);

      const result = await this.pdfService.gerarPdfReserva(
        this.reserva()!.id!,
        this.tipoContratoSelecionado()!
      ).toPromise();

      if (result) {
        this.pdfService.downloadPdf(result.blob, result.filename);

        // Voltar para a lista de reservas após gerar o PDF
        setTimeout(() => {
          this.router.navigate(['/lista-reservas']);
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }

  voltar() {
    this.router.navigate(['/lista-reservas']);
  }
}

