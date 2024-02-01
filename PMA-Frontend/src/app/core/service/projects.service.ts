import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
//import {Http, ResponseContentType} from '@angular/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': "application/json ; multipart/form-data"
  }),
  withCredentials: true,
};
@Injectable({
  providedIn: 'root',
})

export class ProjectsService {

  serverImageUrl = `${environment.apiUrl}/static/images`;
  serverProjectsUrl = `${environment.apiUrl}/projectsFile`;

  readonly baseUrl = environment.apiUrl;
  private ProjectApi = `${this.baseUrl}/api/v1/projects`;
  private localFileApi = `${this.baseUrl}/api/v1/projects`;

  //user=localStorage.getItem("CurrentUser");
  dialogData: any;

  constructor(private authserv: AuthService, private http: HttpClient) {
    //console.log("user",this.authserv.currentUserValue);
  }
  getDialogData() {
    return this.dialogData;
  }
  addProject(data: any): Observable<{}> {
    return this.http.post(`${this.ProjectApi}/addProject`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    });
  }

  getAllProjects(year?: number): Observable<{}> {
    var url = `${this.ProjectApi}/getAllProjects`;
    if (year) {
      url = `${url}?year=${year}`
    }
    return this.http.get(url, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    }).pipe(
      map((res: any) => res.map(project => {
        return {
          ...project,
          equipe: project.equipe.map(user => ({ ...user, image: `${this.serverImageUrl}/${user.image}` }))
        }
      }))
    )
  }
  sendfile(data:any){
    return this.http.post(`${this.ProjectApi}/shareFile`,data).pipe(
      catchError(throwError)
    );
  }
  getAllProjectsDone(): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsDone`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }

  getAllProjectsPending(): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsPending`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  getAllProjectsProgress(): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsProgress`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  getAllProjectsTest(): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getAllProjectsTest`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  getProjectLate(): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getProjectLate`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  updateStatus(id: any, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/updateStatus/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  updateStatusToCompleted(id: any): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/updateStatus/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  updateProject(id: any, data): Observable<{}> {
    this.dialogData = data
    return this.http.patch(`${this.ProjectApi}/updateProject/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  addTeamMember(id: any, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/addTeamMember/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  deleteMember(id: any): Observable<{}> {
    return this.http.delete(`${this.ProjectApi}/deleteMember/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  deleteProject(id: any): Observable<{}> {
    return this.http.delete(`${this.ProjectApi}/deleteProject/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  getProject(id: any): Observable<{}> {
    return this.http.get(`${this.ProjectApi}/getproject/${id}`).pipe(
      map((project: any) => ({
        ...project,
        equipe: project.equipe.map(user => ({
          ...user,
          image: `${this.serverImageUrl}/${user.image}`
        }))
      }))
    )

  }
  getprojectbyClient(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getprojectbyClient/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`,
      },
    })
  }
  createProject(data: any): Observable<{}> {
    this.dialogData = data
    return this.http.post(`${this.ProjectApi}/createProject`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  downloadfile(file: any) {
    return this.http.get(`${this.serverProjectsUrl}/${file}`, { responseType: 'blob' })
  }

  getmyProject(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getmyProjects/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`
      },
    }).pipe(
      map((projects: any) => projects.map(project => {
        return {
          ...project,
          equipe: project.equipe.map(user => ({ ...user, image: `${this.serverImageUrl}/${user.image}` }))
        }
      }))
    )
  }

  getProjectsByTeamleader(id: any): Observable<[]> {
    return this.http.get<[]>(`${this.ProjectApi}/getProjectsByTeamleader/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  getDoneP(id: any): Observable<{}> {
    return this.http.get(`${this.ProjectApi}/getDoneP/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  notequipe(id: any, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/notequipe/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  noteCleint(id, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/noteCleint/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  noteAdmin(id, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/noteAdmin/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addletter(id, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/addletter/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  updateProg(id, data): Observable<{}> {
    return this.http.patch(`${this.ProjectApi}/progress/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }

  addkik(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addkik/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addHLDLLD(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addHLDLLD/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addbuild(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addbuild/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addaccesd(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addaccesd/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addOther(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addOther/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addOther1(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addOther1/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addOther2(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addOther2/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  addOther3(id, data): Observable<{}> {
    return this.http.patch(`${this.localFileApi}/addOther3/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`

      },
    })
  }
  getEngineersParticipations() {
    return this.http.get(`${this.ProjectApi}/getEngineersParticipations`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`
      },
    })
  }
  getTeamLeadersParticipations() {
    return this.http.get(`${this.ProjectApi}/geTeamLeadersParticipations`, {
      headers: {
        Authorization: `Bearer ${this.authserv.currentUserValue}`
      },
    })
  }
}
