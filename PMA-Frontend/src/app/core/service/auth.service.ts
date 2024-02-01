import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import {  map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "application/json ; multipart/form-data"
  }),
  withCredentials: true,
};
@Injectable({
  providedIn: "root",
})
export class AuthService {

  readonly baseUrl = environment.apiUrl;
  private UserApi = `${this.baseUrl}/api/v1/users`;

  serverImagesUrl = `${environment.apiUrl}/static/images`

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router,) {


    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("CurrentUser")));
    this.currentUser = this.currentUserSubject.asObservable();

  }


  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/signup`, data)
  }
  confirm_signup(id: any, data): Observable<{}> {
    return this.http.post(`${this.UserApi}/confirm-signup/${id}`, data);
  }
  getAllSignupRequests(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/signup/requests`, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`
      }
    }).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );
  }
  adduser(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/adduser`, data, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`
      },
    });
  }

  login(email: string, password: string) {

    return this.http.post(`${this.UserApi}/login`, { email, password }).pipe(
      map((user: any) => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })),
      tap((user) => {
        localStorage.setItem("CurrentUser", JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user
      })
    )
  }
  updateuser(id: any, data): Observable<{}> {
    return this.http.patch(`${this.UserApi}/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`

      }
    });
  }
  updateuserRole(id: any, data): Observable<{}> {
    return this.http.patch(`${this.UserApi}/update-roles/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`
      }
    });
  }
  forgotpasswd(email): Observable<{}> {
    return this.http.post(`${this.UserApi}/forgotPassword`, email

    );
  }
  checkpass(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/checkpass`, data);
  }
  validateCode(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/validateCode`, data);
  }
  changePswdAutorisation(id: any): Observable<{}> {
    return this.http.get(`${this.UserApi}/changePswdAutorisation/${id}`);
  }
  change_psw(id: any, data): Observable<{}> {
    return this.http.patch(`${this.UserApi}/change-psw/${id}`, data);
  }
  getallUsers(): Observable<{}> {
    return this.http.get(`${this.UserApi}/getall`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );
  }
  filter(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/filter`, data);
  }
  searchUsers(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/search`, data, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`
      }
    });

  }
  deleteUser(id: any): Observable<{}> {
    return this.http.delete(`${this.UserApi}/delete/${id}`);
  }
  getUserById(id: any): Observable<{}> {
    return this.http.get(`${this.UserApi}/getUserById/${id}`).pipe(
      map((user: any) => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` }))
    )
  }
  getallEngineer(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getAllEng`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );


  }
  getEngineer(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getEngi`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    )
  }
  getallCient(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getAllClient`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );

  }
  getallTeamLeader(): Observable<[]> {
    return this.http.get<[]>(`${this.UserApi}/getAllTeamLeader`).pipe(
      map((users: any) => users.map(user => ({ ...user, image: `${this.serverImagesUrl}/${user.image}` })))
    );

  }
  setAuthTimer(expiresIn: number) {
    setTimeout(() => {
      this.logout();

    }, expiresIn * 1000);
  }
  sendMail(data): Observable<{}> {
    return this.http.post(`${this.UserApi}/email`, data, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`
      }
    });

  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("CurrentUser");
    this.currentUserSubject.next(null);
    this.router.navigate(["/authentication/signin"]);
    return of({ success: false });

  }
}
