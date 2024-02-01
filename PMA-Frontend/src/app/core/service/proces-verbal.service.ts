import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesVerbalService {


  dialogData: any;
  readonly baseUrl = environment.apiUrl;
  private ProcesAPI = `${this.baseUrl}/api/v1/procesV`;

  constructor(private authSer: AuthService, private http: HttpClient) { }



  getDialogDate() {
    return this.dialogData
  }

  addProceVerbal(data: any): Observable<{}> {
    this.dialogData = data
    return this.http.post(`${this.ProcesAPI}/addProcesV`, data, {
      headers: {
        Authorization: `Bearer ${this.authSer.currentUserValue.token}`

      }
    })
  }
  getAllProcesVerbal(): Observable<[]> {
    return this.http.get<[]>(`${this.ProcesAPI}/getAllProcesV`, {
      headers: {
        Authorization: `Bearer ${this.authSer.currentUserValue.token}`
      }
    })

  }

  updateProcesv(id: any, data): Observable<{}> {
    this.dialogData = data
    return this.http.put(`${this.ProcesAPI}/updateProcesv/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authSer.currentUserValue.token}`
      }
    })
  }

  deleteProcesV(id: any): Observable<{}> {
    return this.http.delete(`${this.ProcesAPI}/deleteProcesV/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authSer.currentUserValue.token}`
      }
    })
  }

  getProcesByUser(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProcesAPI}/getProcesByUser/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authSer.currentUserValue.token}`
      }
    })
  }

  getProcesByProject(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProcesAPI}/getProcesByProject/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authSer.currentUserValue.token}`
      }
    })
  }


}
