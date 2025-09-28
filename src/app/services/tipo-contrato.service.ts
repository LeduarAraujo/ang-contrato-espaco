import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoContrato } from '../models/tipo-contrato.model';
import { API_CONFIG, getFullUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {

  constructor(private http: HttpClient) { }

  listarTiposContrato(): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.LISTAR));
  }

  buscarTipoContratoPorId(id: number): Observable<TipoContrato> {
    return this.http.get<TipoContrato>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.BUSCAR, { id }));
  }

  buscarTiposContratoPorEspaco(espacoId: number): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.BUSCAR_POR_ESPACO, { espacoId }));
  }

  buscarTiposContratoPorTipo(tipo: 'CONTRATO' | 'RECIBO'): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.BUSCAR_POR_TIPO, { tipo }));
  }

  criarTipoContrato(tipoContrato: TipoContrato): Observable<TipoContrato> {
    return this.http.post<TipoContrato>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.CRIAR), tipoContrato);
  }

  atualizarTipoContrato(id: number, tipoContrato: TipoContrato): Observable<TipoContrato> {
    return this.http.put<TipoContrato>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.ATUALIZAR, { id }), tipoContrato);
  }

  excluirTipoContrato(id: number): Observable<void> {
    return this.http.delete<void>(getFullUrl(API_CONFIG.TIPOS_CONTRATO.EXCLUIR, { id }));
  }
}
