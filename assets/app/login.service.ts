import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isLoggedin =false;
  public username = '';
  public imgUrl ='';

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  loginGoogle(){
    console.log('Redirecting to Google login provider...');
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());

  }
  login(name:string,pwd:string){

  }
  loginFB(){
    console.log('Redirecting to Facebook login provider...');
    this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }
  logout(){
    this.afAuth.auth.signOut();
    this.isLoggedin = false;
  }
  getLoggedInUser(){
    // console.log(this.afAuth.authState);
    return this.afAuth.authState;
  }


  setLoggedin(val: boolean){
    this.isLoggedin = val;
  }
  setUsername(val: string,url: string){
    this.username = val;
    this.imgUrl = url;
    // console.log(url);
  }
  get isLoggedStatus(){
    return this.isLoggedin;
  }
  get getUsername(){
    return this.username ;
  }
}
