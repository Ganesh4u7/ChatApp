import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';


@Injectable()


export class ChatService{

    allowFind: boolean;

    private socket = io('http://localhost:3000');


    enterName(data){
        this.socket.emit('enter',data);
    }
    findPerson(data){
        this.socket.emit('find',data);
        this.allowFind= false;
    }

    newUserJoined()
    {
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
    newUserEntered()
    {
        let observable = new Observable<Array<{name:String,id:String}>>(observer=>{
            this.socket.on('new user entered', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;

    }
    foundPerson()
    {
        let observable = new Observable<{to:{name:String,id:String}, from:{name:String,id:String}}>(observer=>{
            this.socket.on('found person', (data)=>{
                observer.next(data);


                this.allowFind=true;

            });
            return () => {this.socket.disconnect();}
        });


        return observable;

    }
    foundPersonName()
    {
        let observable = new Observable<{message:String}>(observer=>{
            this.socket.on('found person name', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    leaveRoom(data){
        this.socket.emit('leave',data);
    }

    login(data){
      this.socket.emit('login',data);
    }


  signup(data){
    this.socket.emit('signup',data);
  }
  signupStatus(){
    let observable = new Observable<{success:boolean}>(observer=>{
      this.socket.on('signupStatus', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;

  }

  loginStatus(){
    let observable = new Observable<{success:boolean}>(observer=>{
      this.socket.on('loginStatus', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });
    return observable;
  }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    sendMessage(data)
    {
        this.socket.emit('message',data);
    }

    newMessageReceived(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);

            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
    leftMessage(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
}
