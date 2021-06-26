import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  createFile(file: any): Observable<any> {
    return this.http.post(baseUrl + '/api/file', file);
  }

  fetchFile(user_fk: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/file/fetchFileById/${user_fk}`);
  }

  updateFile(id: any,file:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/file//updateFile/${id}`,file);
  }
}
