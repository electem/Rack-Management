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

  searchRack(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/rack/searchRack`, data);
  }

  createRack(rackData: any): Observable<any> {
    return this.http.post(baseUrl + '/api/rack/createRack', rackData);
  }

  createTray(trayData: any): Observable<any> {
    return this.http.post(baseUrl + '/api/rack/tray', trayData);
  }

  updateTray(id: any, trayObject: any): Observable<any> {
    return this.http.put(baseUrl + '/api/rack/tray/' + `${id}`, trayObject);
  }

  updateRack(id: any, rackObject: any): Observable<any> {
    return this.http.put(baseUrl + '/api/rack/' + `${id}`, rackObject);
  }

  fetchTrayById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/rack/tray/${id}`);
  }

  fetchAllRacks(client_fk: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/rack/${client_fk}`);
  }

  saveTrayLayout(trayList: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/rack/tray/props/`, trayList);
  }

  getTrayPropById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/rack/traylisting/props/${id}`);
  }

  getTrayDataById(rack_fk: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/rack/traylisting/data/${rack_fk}`);
  }

  createTrayItems(trayItem: any): Observable<any> {
    return this.http.post(baseUrl + '/api/trayItem/createTrayItem', trayItem);
  }

  updateTrayItem(formId: any,trayItem:any): Observable<any> {
    return this.http.put(baseUrl + '/api/trayItem/' + `${formId}`, trayItem);
  }

  getItemById(formId: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/trayItem/fetchItem/${formId}`);
  }

  fetchAllItems(): Observable<any> {
    return this.http.get(`${baseUrl}/api/trayItem/findAllItems`);
  }

}
