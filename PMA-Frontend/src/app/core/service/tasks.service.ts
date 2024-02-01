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
export class TasksService {
  dialogData: any

  readonly baseUrl = environment.apiUrl;
  private taskApi = `${this.baseUrl}/api/v1/tasks`;

  getDialogData() {
    return this.dialogData;
  }
  constructor(private authserv: AuthService, private http: HttpClient) { }

  addTask(data: any): Observable<{}> {
    this.dialogData = data
    return this.http.post(`${this.taskApi}/createTask`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue.token}`

      }
    })
  }
  getAll(): Observable<[]> {
    var url = `${this.taskApi}/getAllTasks`;
    return this.http.get<[]>(url)
  }

  updatetask(id, data: any) {
    this.dialogData = data
    return this.http.put(`${this.taskApi}/updateTask/${id}`, data, { headers: { Authorization: `Bearer ${this.authserv.currentUserValue.token}` } })
  }
  updateTaskStatus(id, data: any) {
    return this.http.patch(`${this.taskApi}/updateTaskStatus/${id}`, data, { headers: { Authorization: `Bearer ${this.authserv.currentUserValue.token}` } })
  }
  deleteTask(id) {
    return this.http.delete(`${this.taskApi}/deleteTaks/${id}`, { headers: { Authorization: `Bearer ${this.authserv.currentUserValue.token}` } })
  }

  getTaskbyproject(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.taskApi}/getTaskByProject/${id}`, { headers: { Authorization: `Bearer ${this.authserv.currentUserValue.token}` } })
  }

  getTaskbyprojectWithSort(id: any, statusSort: string, dateSort: number): Observable<[]> {
    return this.http.get<[]>(`${this.taskApi}/getTaskByProject/${id}?status=${statusSort}&date=${dateSort}`, { headers: { Authorization: `Bearer ${this.authserv.currentUserValue.token}` } })
  }

  getTaskByExecutor(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.taskApi}/getTaskByExecutor/${id}`, { headers: { Authorization: `Bearer ${this.authserv.currentUserValue.token}` } })
  }

  getTasksByTeamLeader(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.taskApi}/gettskks/${id}`, {
      headers: {
        Authorization: `Bearer
  ${this.authserv.currentUserValue.token}`
      }
    }
    )
  }
}



