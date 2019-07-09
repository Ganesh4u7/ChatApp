import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ChatService} from "../chat.service";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {AngularFireDatabase} from "@angular/fire/database";
import {leave} from "@angular/core/src/profile/wtf_impl";



@Component({
  selector:'chat-box',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  providers:[ChatService]
})

export class ChatboxComponent implements OnInit,OnDestroy,AfterViewChecked{

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  user:String;
  allow=false;
  allowFind: boolean;
  room:String;
  users:Array<{name:String,id:String}> =[];
  messageText:String = '';
  chatDetails:{};
  FPurl : string ;
  chatData= 0;
  msgData = 0;
  imgUrl: string ;



  messageArray:Array<{user:String,message:String}> = [];
  constructor(private _chatService:ChatService,
              private router:Router,
              private  loginService:LoginService
              private db:AngularFireDatabase
  ){


    this.allowFind = this._chatService.allowFind;

    this._chatService.newUserJoined()
      .subscribe(data=> this.messageArray.push(data));

    this._chatService.newUserEntered()
      .subscribe(data=> this.users = data;
  );
    this._chatService.foundPerson()
      .subscribe(data=> {this.chatDetails = data;
      this.chatData = 1;
      this.FPurl = data.to.url;
       console.log(data);}

  );
    this._chatService.foundPersonName()
      .subscribe(data=> this.messageArray.push(data);

  );

    this._chatService.userLeftRoom()
      .subscribe(data=>
        this.messageArray.push(data);
    this.chatDetails= {};
    );

    this._chatService.newMessageReceived()
      .subscribe(data=>{this.messageArray.push(data);
      this.msgData = 1;
    console.log(data);});

    this._chatService.leftMessage()
      .subscribe(data=>{
        this.messageArray = [];
          this.msgData=0;
        this.messageArray.push(data);
        this.chatDetails= {};
      this.chatData=0;}
      );

  }

ngOnInit(){
    this.user = this.loginService.username;
    this.imgUrl = this.loginService.imgUrl;
  this._chatService.enterName({user:this.user});
  this.scrollToBottom();

}
ngAfterViewChecked() {
  this.scrollToBottom();
}
// ngOnDestroy(): void {
//
//   const toName= this.chatDetails.to.name;
//   const fromName= this.chatDetails.from.name;
//   const to= this.chatDetails.to.id;
//   const from= this.chatDetails.from.id;
//   this.allowFind=false;
//
//   this._chatService.leaveRoom({user:this.user,to:to,from:from, toName:toName,fromName:fromName, room:this.room});
//   this.messageArray = [];
//   this.msgData=0;
//   this.chatData=0;
//   this.chatDetails = {};
//   this.loginService.logout();
// }

scrollToBottom(): void {
  try {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
} catch(err) { }
}




  find(){
    this._chatService.findPerson({user:this.user});


  }

  leave(){
    const toName= this.chatDetails.to.name;
    const fromName= this.chatDetails.from.name;
    const to= this.chatDetails.to.id;
    const from= this.chatDetails.from.id;
    this.allowFind=false;

    this._chatService.leaveRoom({user:this.user,to:to,from:from, toName:toName,fromName:fromName, room:this.room});
    this.messageArray = [];
    this.msgData=0;
    this.chatData=0;
    this.chatDetails = {};
  }

  sendMessage()
  {
    const to= this.chatDetails.to.id;
    const from= this.chatDetails.from.id;
    const toName = this.chatDetails.to.name;
    console.log(toName);
    this._chatService.sendMessage({user:this.user, to:to, from:from, toName: toName,message:this.messageText});
    this.messageText = '';
  }

  logout(){
    if(this.chatData == 1) {
      const toName= this.chatDetails.to.name;
      const fromName= this.chatDetails.from.name;
      const to= this.chatDetails.to.id;
      const from= this.chatDetails.from.id;
      this.allowFind=false;

      this._chatService.leaveRoom({user:this.user,to:to,from:from, toName:toName,fromName:fromName, room:this.room});

    }
  this.messageArray = [];
  this.msgData=0;
  this.chatData=0;
  this.chatDetails = {};

    this.router.navigate(['/']);
  }
}
