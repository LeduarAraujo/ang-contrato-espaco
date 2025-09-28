import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espaco } from '../models/espaco.model';
import { API_CONFIG, getFullUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EspacoService {

  constructor(private http: HttpClient) { }

  listarEspacos(): Observable<Espaco[]> {
    return this.http.get<Espaco[]>(getFullUrl(API_CONFIG.ESPACOS.LISTAR));
  }

  buscarEspacoPorId(id: number): Observable<Espaco> {
    return this.http.get<Espaco>(getFullUrl(API_CONFIG.ESPACOS.BUSCAR, { id }));
  }

  buscarEspacosPorNome(nome: string): Observable<Espaco[]> {
    return this.http.get<Espaco[]>(getFullUrl(API_CONFIG.ESPACOS.BUSCAR_POR_NOME), {
      params: { nome }
    });
  }

  criarEspaco(espaco: Espaco): Observable<Espaco> {
    console.log('EspacoService: Criando espaço:', espaco);
    console.log('EspacoService: URL de criação:', getFullUrl(API_CONFIG.ESPACOS.CRIAR));
    return this.http.post<Espaco>(getFullUrl(API_CONFIG.ESPACOS.CRIAR), espaco);
  }

  criarEspacoComImagem(nome: string, logo: File | null, nomeProprietario?: string, cnpjProprietario?: string): Observable<Espaco> {
    console.log('EspacoService: Criando espaço com imagem:', nome);
    console.log('EspacoService: Nome do proprietário:', nomeProprietario);
    console.log('EspacoService: CNPJ do proprietário:', cnpjProprietario);

    const formData = new FormData();
    formData.append('nome', nome);

    if (nomeProprietario) {
      formData.append('nomeProprietario', nomeProprietario);
    }

    if (cnpjProprietario) {
      formData.append('cnpjProprietario', cnpjProprietario);
    }

    if (logo) {
      formData.append('logo', logo);
      console.log('EspacoService: Arquivo adicionado ao FormData:', logo.name);
    }

    const url = getFullUrl(API_CONFIG.ESPACOS.CRIAR) + '/com-imagem';
    console.log('EspacoService: URL de criação com imagem:', url);

    return this.http.post<Espaco>(url, formData);
  }

  atualizarEspaco(id: number, espaco: Espaco): Observable<Espaco> {
    return this.http.put<Espaco>(getFullUrl(API_CONFIG.ESPACOS.ATUALIZAR, { id }), espaco);
  }

  excluirEspaco(id: number): Observable<void> {
    return this.http.delete<void>(getFullUrl(API_CONFIG.ESPACOS.EXCLUIR, { id }));
  }

  buscarLogoBase64(id: number): Observable<string> {
    return this.http.get<string>(getFullUrl(API_CONFIG.ESPACOS.BUSCAR, { id }) + '/logo');
  }
}
