import { Client } from './../client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class RackService {

  constructor(private http: HttpClient) { }

  getRackById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/rack/fetchRackById/${id}`);
  }

  deleteRackById(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/api/rack/${id}`);
  }

  deleteTrayById(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/api/rack/tray/${id}`);
  }

  searchRack(data:any): Observable<any> {
    return this.http.post(`${baseUrl}/api/rack/searchRack`,data);
  }

  createRack(rackData: any): Observable<any> {
    return this.http.post(baseUrl + '/api/rack/createRack', rackData);
  }

  updateTray(id:any,trayObject:any): Observable<any> {
    return this.http.put(baseUrl + '/api/rack/tray/'+`${id}`,trayObject);
  }

  updateRack(id: any,rackObject:any): Observable<any> {
    return this.http.put(baseUrl + '/api/rack/'+`${id}`,rackObject);
  }
}
