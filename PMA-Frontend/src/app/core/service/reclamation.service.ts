import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': "application/json ; multipart/form-data"
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  dialogData: any;

  readonly baseUrl = environment.apiUrl;
  private reclamationAPI = `${this.baseUrl}/api/v1/reclamations`;

  constructor(private authserv: AuthService, private http: HttpClient) { }
  getDialogData() {
    return this.dialogData;
  }
  addReclamation(data: any): Observable<{}> {
    this.dialogData = data
    return this.http.post(`${this.reclamationAPI}/AddReclamation`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })



  }
  getAllReclamations(): Observable<[]> {
    var url = `${this.reclamationAPI}/getAllReclamations`;
    return this.http.get<[]>(url);
  }

  getAllReclamationsPending() {
    var url = `${this.reclamationAPI}/getAllReclamationsPending`;
    return this.http.get<[]>(url);
  }


  deleteReclamation(id): Observable<{}> {
    return this.http.delete(`${this.reclamationAPI}/deleteReclamation/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }


  UpdateReclamationStatus(id, data): Observable<{}> {
    return this.http.patch(`${this.reclamationAPI}/UpdateReclamationStatus/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  UpdateReclamation(id: any, data): Observable<{}> {
    this.dialogData = data

    return this.http.patch(`${this.reclamationAPI}/UpdateReclamation/${id}`, data,
      {
        headers: {
          Authorization: `Bearer ${this.authserv.currentUserValue.token}`

        }
      }
    )
  }
  getReclamationByProject(id: any): Observable<{}> {
    return this.http.get(`${this.reclamationAPI}/getReclamationsByProject/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getReclamtionByCleit(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.reclamationAPI}/getReclamationsByclient/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getReclamtionsbyProduct(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.reclamationAPI}/getRclms/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
}
