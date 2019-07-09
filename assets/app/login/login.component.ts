import {Component, OnInit, ViewChild} from '@angular/core';

import {LoginService} from '../login.service';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {ChatService} from "../chat.service";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AngularFireDatabase} from "@angular/fire/database";

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {Popup} from "ng2-opd-popup";

import io from 'socket.io-client';

import * as firebase from 'firebase';
import {FirebaseObjectObservable} from "@angular/fire/database-deprecated";


interface FeaturedPhotoUrls {
  url:string;

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  declarations: [ImageCropperComponent]
})
export class LoginComponent implements OnInit {

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  data: File;
  cropperSettings: CropperSettings;

  FeaturedPhotoStream:FirebaseObjectObservable<FeaturedPhotoUrls>;

  user:firebase.User;
  signupForm: FormGroup;
  loginForm: FormGroup;
  passCheck : string;
  errMsg: string;
  selectedFile:File;
  imgUrl: string;
  file =0;
  url;
  width,height =0;
  NoImageUrl ="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";




  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: LoginService,
              private chatService: ChatService,
              private http:HttpClient,
              private db: AngularFireDatabase,
              private popup: Popup
  ) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    //console.log(this.data);

    this.data = {};

    this.FeaturedPhotoStream = this.db.object('/photos')

    this.chatService.signupStatus().subscribe(data=>{


      console.log(data)
      if(data.success == true){

        this.router.navigate(['/chat']);
        this.service.setLoggedin(true);
        this.service.setUsername(data.username,data.url);

      }
      else{
         this.errMsg = 'Username Taken ,Please Try with another name';
      }

  });

    this.chatService.loginStatus().subscribe(data=> {
      // console.log(data.success)
      if (data.success == true) {
        this.router.navigate(['/chat']);
        this.service.setLoggedin(true);
        var Url= '';

        firebase.database().ref('photos/' + data.username).once('value').then(snapshot =>{
          this.imgUrl = snapshot.val();


        });
        // setTimeout(()=>{
        //   console.log(this.imgUrl);
        //
        // },500);
        // console.log(data.url);
        this.service.setUsername(data.username,data.url);

      }
      else {
        this.errMsg = 'Username Taken ,Please Try with another Naame';
      }

    });

  }


  onFileSelected(event: any){
    // console.log(event.target.files[0]);
     const file : File = event.target.files[0];

     this.file = 1;
     this.selectedFile = file;
    //  console.log(event.target.files[0]);
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();
    //
    //   reader.readAsDataURL(event.target.files[0]); // read file as data url
    //
    //   reader.onload = (event) => { // called once readAsDataURL is completed
    //     var base64result = event.target.result.split(',')[1];
    //     this.url = base64result;
    //   }
    // }
    //
    // var image:any = new Image();
    // var file:File = event.target.files[0];
    // var myReader:FileReader = new FileReader();
    // var that = this;
    // myReader.onloadend = function (loadEvent:any) {
    //   image.src = loadEvent.target.result;
    //   that.cropper.setImage(image);
    //
    //
    // };
    // myReader.readAsDataURL(file);
 // console.log(myReader.readAsDataURL(file););

  }


 const loginForm = new FormGroup({
    username: new FormControl(),
    pwd: new FormControl()
  });

  // var p1 = this.signupForm.get('pwd').value;
  // var p2 = this.signupForm.get('cpwd').value;

// function passwordMatchValidator(g: FormGroup) {
//   return g.get('pwd').value === g.get('cpwd').value
//     ? null : {'mismatch': true};
// };

  // if(p1 === p2 ){
  //   this.passCheck = 'Password Matched';
  // }
  // else {
  //   this.passCheck = 'Password not Matched';
  // }

  ngOnInit(){
  this.signupForm = new FormGroup({
    username: new FormControl(null),
    pwd:new FormControl(null),
    cpwd: new FormControl(null),
    email: new FormControl(null)});

    this.loginForm = new FormGroup({
      username: new FormControl(null),
      pwd: new FormControl(null)
    });

    this.service.getLoggedInUser()
      .subscribe(user => {
        if (user) {

         // console.log(user);
          this.user = user;

          if(user) {

            this.chatService.login({name:user.displayName,email:user.email});
            this.router.navigate(['/chat']);
            this.service.setLoggedin(true);
            this.service.setUsername(user.displayName);
          }
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

  onLogin(form: FormGroup){
    var name = this.loginForm.value.username;
    var pwd = this.loginForm.value.pwd;
    this.chatService.login({username:name,password:pwd});

  }

 onSignUp(form: FormGroup){

  if(this.signupForm.value.pwd == this.signupForm.value.cpwd){

    this.passCheck = "Matched";
   var data = JSON.stringify(this.signupForm.value);

   var username = this.signupForm.value.username;
   var email = this.signupForm.value.email;
   var pwd = this.signupForm.value.pwd;
   // console.log(username);
   // console.log(this.passCheck);


 if(this.file == 1) {
   var file:File = this.selectedFile;
   const metaData = {contentType: 'image/jpeg'};
   var downloadUrl;
 // console.log(file);

   const storageRef: firebase.storage.Reference = firebase.storage().ref('photos/' + username);
   storageRef.put(file, metaData).then(snapshot => {

     snapshot.ref.getDownloadURL().then(url => {
      // console.log('Url:' + url);
       downloadUrl = url;
       //console.log(downloadUrl);

       firebase.database().ref('photos/' + username).set(downloadUrl);
       this.chatService.signup({username: username, email: email, password: pwd, url: downloadUrl});
     //console.log(downloadUrl);
     //this.chatService.signup({username: username ,email:email,password :pwd,url:downloadUrl});

   });

 }
 }
 else {
   this.chatService.signup({username: username, email: email, password: pwd, url: this.NoImageUrl});

 }



    }
  }

uploadImage(){
    this.popup.show();
    this.popup.options = {
      header: "Your custom header",
      color: "blue", // red, blue....
      widthProsentage: 140, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: "OK", // The text on your confirm button
      cancleBtnContent: "Cancel", // the text on your cancel button
      confirmBtnClass: "btn btn-success", // your class for styling the confirm button
      cancleBtnClass: "btn btn-danger", // you class for styling the cancel button
      animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    }
}
  YourConfirmEvent(){
    this.popup.hide();
  }

}
