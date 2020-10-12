import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
    return this.http.post(`${environment.apiUrl}/user/login`, data)
      .pipe(
        map((res: any) => {
          localStorage.setItem('token', res.token);
          this.authenticationState.next(true);
        })
      );
  }

  register(data: any) {
    return this.http.post(`${environment.apiUrl}/user`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticationState.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
