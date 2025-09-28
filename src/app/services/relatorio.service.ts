import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Relatorio } from '../models/relatorio.model';
import { API_CONFIG, getFullUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor(private http: HttpClient) { }

  listarRelatorios(): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(getFullUrl(API_CONFIG.RELATORIOS.LISTAR));
  }

  buscarRelatorioPorId(id: number): Observable<Relatorio> {
    return this.http.get<Relatorio>(getFullUrl(API_CONFIG.RELATORIOS.BUSCAR, { id }));
  }

  buscarRelatoriosPorTipoContrato(tipoContratoId: number): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(getFullUrl(API_CONFIG.RELATORIOS.BUSCAR_POR_TIPO_CONTRATO, { tipoContratoId }));
  }

  buscarRelatoriosPorPeriodo(dataInicio: string, dataFim: string): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(getFullUrl(API_CONFIG.RELATORIOS.BUSCAR_POR_PERIODO), {
      params: { dataInicio, dataFim }
    });
  }

  buscarRelatoriosPorNomeCliente(nome: string): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(getFullUrl(API_CONFIG.RELATORIOS.BUSCAR_POR_CLIENTE), {
      params: { nome }
    });
  }

  buscarRelatoriosPorCpf(cpf: string): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(getFullUrl(API_CONFIG.RELATORIOS.BUSCAR_POR_CPF), {
      params: { cpf }
    });
  }

  criarRelatorio(relatorio: Relatorio): Observable<Relatorio> {
    return this.http.post<Relatorio>(getFullUrl(API_CONFIG.RELATORIOS.CRIAR), relatorio);
  }

  atualizarRelatorio(id: number, relatorio: Relatorio): Observable<Relatorio> {
    return this.http.put<Relatorio>(getFullUrl(API_CONFIG.RELATORIOS.ATUALIZAR, { id }), relatorio);
  }

  excluirRelatorio(id: number): Observable<void> {
    return this.http.delete<void>(getFullUrl(API_CONFIG.RELATORIOS.EXCLUIR, { id }));
  }

  gerarPdf(id: number): Observable<{blob: Blob, filename: string}> {
    return this.http.get(getFullUrl(API_CONFIG.RELATORIOS.BUSCAR, { id }) + '/pdf', {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map(response => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `relatorio_${id}.pdf`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        return { blob, filename };
      })
    );
  }
}
