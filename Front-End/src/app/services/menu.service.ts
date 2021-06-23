import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getRoleById(roleId: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/menu/item/${roleId}`);
  }

  getMenuByItemId(itemId: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/menu/item/${itemId}`);
  }

  fetchAllMenus(clientFk:any, roleId:any): Observable<any> {
    return this.http.get(`${baseUrl}/api/menu/?clientFk=${clientFk}&roleId=${roleId}`);
  }

  createMenu(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/menu/createMenu', data);
  }

}
