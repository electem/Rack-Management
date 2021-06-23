import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';
import { Product } from 'src/app/models/form.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  getAll(clientFk: any): Observable<Template[]> {
    return this.http.get<Template[]>(`${baseUrl}/api/items?clientFk=${clientFk}`);
  }

  get(id: any): Observable<Template> {
    return this.http.get(`${baseUrl}/api/items/${id}`);
  }

  getById(name: any, id: any): Observable<Template> {
    return this.http.get(`${baseUrl}/api/items/${name}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/items', data);
  }

  saveForm(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/items', data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/api/items/${id}`, data);
  }

  updateForm(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/api/items/${id}`, data);
  }

  delete(id: any, name:any): Observable<any> {
    return this.http.delete(`${baseUrl}/api/items/${id}/${name}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl + '/api/items');
  }

  findByTitle(name: any): Observable<Template[]> {
    return this.http.get<Template[]>(`${baseUrl}/api/items?name=${name}`);
  }

  createForm(data: any, tempName: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/form?tempName=${tempName}`, data);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(baseUrl + '/api/form');
  }

  getAllProductsByItemTempId(itemTempId: any, formName: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/api/form?itemTempId=${itemTempId}&formName=${formName}`);
  }

  getFormData(id: any): Observable<Product> {
    return this.http.get(`${baseUrl}/api/form/${id}`);
  }

  getFormDataByName(id: any, name: any): Observable<Product> {
    return this.http.get(`${baseUrl}/api/form/${id}/${name}`);
  }

  updateFormData(id: any, data: any, name: any): Observable<any> {
    return this.http.put(`${baseUrl}/api/form/${id}/${name}`, data);
  }

  deleteFormData(id: any, name: any): Observable<any> {
    return this.http.delete(`${baseUrl}/api/form/${id}/${name}`);
  }

  findByFormsName(name: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/api/form?name=${name}`);
  }

  
}
