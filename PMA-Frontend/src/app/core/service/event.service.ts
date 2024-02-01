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
export class EventService {
  readonly baseUrl = environment.apiUrl;
  private EventApi = `${this.baseUrl}/api/v1/Events`;
  dialogData
  constructor(private authserv: AuthService,
    private http: HttpClient) {
  }
  getDialogData() {
    return this.dialogData;
  }
  addEvent(data: any): Observable<{}> {
    this.dialogData = data
    return this.http.post(`${this.EventApi}/createEvent`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }

  deleteEvent(id): Observable<{}> {
    return this.http.delete(`${this.EventApi}/deleteEvent/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }


  updatEvent(id, data: any): Observable<{}> {
    this.dialogData = data
    return this.http.patch(`${this.EventApi}/updateEvent/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }

  updateEventCategroy(id, data: any): Observable<{}> {

    return this.http.patch(`${this.EventApi}/updateEventCategory/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }

  getAllEvent(): Observable<[]> {
    return this.http.get<[]>(`${this.EventApi}/getAllEvent`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }

  getEventbyId(id): Observable<{}> {
    return this.http.get<{}>(`${this.EventApi}/getEventById/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  /* getAllWorkEvent
  getAllPersonalEvent
  getAllTravelEvent
  getAllFreindsEvent
  getAllImportantEvent */

  getWorkEvent(): Observable<[]> {
    return this.http.get<[]>(`${this.EventApi}/getAllWorkEvent`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getPersonalEvent(): Observable<[]> {
    return this.http.get<[]>(`${this.EventApi}/getAllPersonalEvent`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getAllTravelEvent(): Observable<[]> {
    return this.http.get<[]>(`${this.EventApi}/getAllTravelEvent`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getAllImportantEvent(): Observable<[]> {
    return this.http.get<[]>(`${this.EventApi}/getAllImportantEvent`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getEventByuser(user): Observable<[]> {
    return this.http.get<[]>(`${this.EventApi}/getEventbyUser/${user}`)
  }





}


