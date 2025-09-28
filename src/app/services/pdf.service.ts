import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFullUrl, API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) { }

  gerarPdfReserva(reservaId: number, tipoContratoId: number): Observable<{blob: Blob, filename: string}> {
    const params = new HttpParams().set('tipoContratoId', tipoContratoId.toString());
    
    return this.http.get(`${API_CONFIG.BASE_URL}/pdf/reserva/${reservaId}`, {
      responseType: 'blob',
      observe: 'response',
      params: params
    }).pipe(
      map(response => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `documento_${reservaId}.pdf`;
        
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

  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

