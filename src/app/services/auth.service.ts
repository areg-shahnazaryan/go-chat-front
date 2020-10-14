import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  public checkToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authenticationState.next(true);
    } else {
      localStorage.removeItem('token');
    }
  }

  login(data: any) {
    return this.http.post(`${environment.apiUrl}/users/login`, data)
      .pipe(
        map((res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId);
          this.authenticationState.next(true);
        })
      );
  }

  register(data: any) {
    return this.http.post(`${environment.apiUrl}/users`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticationState.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getUserData() {
    const userId = localStorage.getItem('userId');
    return this.http.get(`${environment.apiUrl}/users/${userId}`, {headers: this.creatingHeader()});
  }

  sendMessage(userName: string, message: string) {
    return this.http.post(`${environment.apiUrl}/users/login/messages`, {
      userName,
      message
    }, {headers: this.creatingHeader()});
  }

  creatingHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers: HttpHeaders = new HttpHeaders();
    return headers.append('Authorization', `Bearer ${token}`);
  }
}
