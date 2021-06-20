import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  createUserProfile(profile: any): Observable<any> {
    return this.http.post(baseUrl + '/api/profile/createProfile', profile);
  }

  updateProfile(id: any,profile:any): Observable<any> {
    return this.http.put(baseUrl + '/api/profile/'+`${id}`,profile);
  }

  updatePassword(id:any,profile:any): Observable<any> {
    return this.http.put(baseUrl + '/api/profile/updatePassword/'+`${id}`,profile);
  }

  fetchProfileByUserFK(user_fk: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/profile/fetchProfileByUserFK/${user_fk}`);
  }

  fetchProfileById(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/api/profile/fetchProfileById/${id}`);
  }

  fetchAllProfiles(): Observable<any> {
    return this.http.get(`${baseUrl}/api/profile/fetchAllProfiles`);
  }

  
  
}
