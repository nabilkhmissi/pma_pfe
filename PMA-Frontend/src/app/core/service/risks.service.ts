import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RisksService {
  dialogData: any;

  readonly baseUrl = environment.apiUrl;
  private RisksAPI = `${this.baseUrl}/api/v1/problems`;

  constructor(private authserv: AuthService, private http: HttpClient) { }
  getDialogData() {
    return this.dialogData;
  }

  addRisk(data: any): Observable<{}> {
    this.dialogData = data;
    return this.http.post(`${this.RisksAPI}/createProb`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`,
      },
    });
  }
  getAllProblemes(): Observable<[]> {
    return this.http.get<[]>(`${this.RisksAPI}/getAllProblemes`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`,
      },
    });
  }
  getProbyUSer(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.RisksAPI}/getProbyUSer/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`,
      },
    });
  }
  getProbyProj(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.RisksAPI}/getProbyProj/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`,
      },
    });
  }

  updateProbleme(id: any, data: any): Observable<{}> {
    this.dialogData = data
    return this.http.put(`${this.RisksAPI}/updateProb/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`
      }
    })


  }

  deleteProbleme(id: any): Observable<{}> {
    return this.http.delete(`${this.RisksAPI}/deleteProbleme/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`
      }
    })
  }

}








