import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  messageVal = '';
  userData: UserClass = {
    firstName: null,
    lastName: null
  };
  iterator = 0;
  subscription: Subscription = new Subscription();


  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUserData().subscribe((data: any) => {
      this.userData.firstName = data.firstName;
      this.userData.lastName = data.lastName;
    });
  }

  logout() {
    this.authService.logout();
  }

  addInput(e) {
    if (this.messageVal.length !== 0 && (e === 'clicked' || e.key === 'Enter')) {
      const currentMessage = this.messageVal;
      const messageData = {
        message: '',
        status: 'pending',
        id: this.iterator
      };
      const sub = this.authService.sendMessage(this.userData.firstName, this.messageVal).subscribe(() => {
        this.messages[this.iterator].status = true;
        this.iterator++;
      }, () => {
        this.messages[this.iterator].status = false;
        this.iterator++;
      });
      this.subscription.add(sub);
      messageData.message = currentMessage;
      this.messages.push(messageData);
      this.messageVal = '';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
