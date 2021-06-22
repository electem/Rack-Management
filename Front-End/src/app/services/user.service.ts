import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/user', data);
  }

  login(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/user' + '/login', data);
  }

  createClient(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/user' + '/client', data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/user/client/resetPassword',data);
  }
  
  backendValidation(value: any,type:any): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/client/validation/${value}/${type}`);
  }

  saveClientStaff(clientName:any, data: any): Observable<any> {
    return this.http.post(baseUrl + '/api/user/client/staff/save/'+ clientName, data);
  }

  getStaffRole(): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/client/staff/role`);
  }

  getClientStaffList(clientFk: any, roleId:any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/api/user/client/staff?clientFk=${clientFk}&roleId=${roleId}`);
  }

  getClientName(clientFk: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/api/user/client/name?clientFk=${clientFk}`);
  }

  get(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/client/staff/${id}`);
  }

  updateClientStaff(id:any, data: any): Observable<any> {
    return this.http.put(baseUrl + '/api/user/client/staff/update/'+id, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/api/user/client/staff/delete/${id}`);
  }

  getPlansList() : Observable<any> {
    return this.http.get(`${baseUrl}/api/user/client/plans`);
  }

  getRoleNameByID(roleId:any): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/role?roleId=${roleId}`);
  }
}
