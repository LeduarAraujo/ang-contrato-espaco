import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, getFullUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('FileService: Fazendo upload do arquivo:', file.name, 'Tamanho:', file.size);
    console.log('FileService: URL de upload:', getFullUrl('/files/upload'));

    return this.http.post<string>(getFullUrl('/files/upload'), formData);
  }
}
