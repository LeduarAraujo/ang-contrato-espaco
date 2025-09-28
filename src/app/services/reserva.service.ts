import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';
import { API_CONFIG, getFullUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private http: HttpClient) { }

  listarReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(getFullUrl(API_CONFIG.RESERVAS.LISTAR));
  }

  buscarReservaPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(getFullUrl(API_CONFIG.RESERVAS.BUSCAR, { id }));
  }

  buscarReservasPorEspaco(espacoId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(getFullUrl(API_CONFIG.RESERVAS.BUSCAR_POR_ESPACO, { espacoId }));
  }

  buscarReservasPorPeriodo(dataInicio: string, dataFim: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(getFullUrl(API_CONFIG.RESERVAS.BUSCAR_POR_PERIODO), {
      params: { dataInicio, dataFim }
    });
  }

  buscarReservasPorNomeCliente(nome: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(getFullUrl(API_CONFIG.RESERVAS.BUSCAR_POR_CLIENTE), {
      params: { nome }
    });
  }

  buscarReservasPorCpf(cpf: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(getFullUrl(API_CONFIG.RESERVAS.BUSCAR_POR_CPF), {
      params: { cpf }
    });
  }

  criarReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(getFullUrl(API_CONFIG.RESERVAS.CRIAR), reserva);
  }

  atualizarReserva(id: number, reserva: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(getFullUrl(API_CONFIG.RESERVAS.ATUALIZAR, { id }), reserva);
  }

  excluirReserva(id: number): Observable<void> {
    return this.http.delete<void>(getFullUrl(API_CONFIG.RESERVAS.EXCLUIR, { id }));
  }
}
