import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {delay, timeout} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  openRegister: boolean = false;
  showLoginErrors: boolean = false;
  modalText = '';
  modalClass = 'modal';
  subscription: Subscription = new Subscription();
  loginForm: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  registerForm: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.authenticationState.getValue()) {
      this.router.navigate(['']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res) => {
        this.router.navigate(['']);
      }, (err) => {
        this.modalText = 'Something went wrong :(';
        this.modalClass = 'modal dis-block';
        const sub1 = of(null).pipe(
          delay(1500)
        ).subscribe(() => {
          this.modalClass = 'modal';
        });
        this.subscription.add(sub1);
      });
    } else {
      this.showLoginErrors = true;
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe((res) => {
        this.openModal();
      }, (err) => {
        this.modalText = 'Something went wrong :(';
        this.modalClass = 'modal dis-block';
        const sub1 = of(null).pipe(
          delay(1500)
        ).subscribe(() => {
          this.modalClass = 'modal';
        });
        this.subscription.add(sub1);
      });
    }
  }

  openModal() {
    this.modalText = 'User successfully created &#10003;';
    this.modalClass = 'modal dis-block';
    const sub1 = of(null).pipe(
      delay(3000)
    ).subscribe(() => {
      this.openRegister = false;
      this.modalClass = 'modal';
    });
    this.subscription.add(sub1);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
