import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

import {LoginService} from '../login.service';
import {ChatService} from "../chat.service";

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:firebase.User;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: LoginService,
              private chatService: ChatService
  ) {

  }

  ngOnInit() {

    this.service.getLoggedInUser()
      .subscribe(user => {
        if (user) {

          console.log(user);
          this.user = user;

           // this.router.navigate(['/chat']);
           // this.service.setLoggedin(true);
           // this.service.setUsername(user.displayName);
          this.chatService.enterName(user.displayName);

        }
      })
  }
  loginGoogle(){
    console.log('Login..');
    this.service.login();


  }
  loginFB(){
    console.log("Login..");
    this.service.loginFB();
  }
  logout(){
    this.service.logout();
  }
}
