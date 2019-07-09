import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule,ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";


import {AngularFireModule} from '@angular/fire';
import { AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from "@angular/fire/database";

import { AppComponent } from "./app.component";
import {LoginComponent} from "./login/login.component";
import {ChatboxComponent} from "./chatbox/chatbox.component";
import {AppRoutingModule} from "./app-routing.module";
import {LoginService} from "./login.service";
import {AuthGuard} from "./auth.guard";
import {ChatService} from "./chat.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ImageCropperComponent} from "ng2-img-cropper";
import {PopupModule} from "ng2-opd-popup";

// import 'hammerjs';
//
// import {
//   LyThemeModule,
//   LY_THEME
// } from '@alyle/ui';
//
//
// import { LyButtonModule } from '@alyle/ui/button';
// import { LyToolbarModule } from '@alyle/ui/toolbar';
// import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
//
// import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';


export const firebaseConfig = {
  apiKey: "AIzaSyBB5RJbFw4uuHr_kCDPi_fhnmojCookKXw",
  authDomain: "anonymouschatapp-183ee.firebaseapp.com",
  databaseURL: "https://anonymouschatapp-183ee.firebaseio.com",
  projectId: "anonymouschatapp-183ee",
  storageBucket: "anonymouschatapp-183ee.appspot.com",
  messagingSenderId: "909628936427"
};


@NgModule({
    declarations: [AppComponent,LoginComponent,ChatboxComponent, ImageCropperComponent],
    imports: [BrowserModule, FormsModule,ReactiveFormsModule,HttpModule,AppRoutingModule,HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireDatabaseModule,
      AngularFireAuthModule,
      PopupModule.forRoot()
    ],
  providers:[AuthGuard,LoginService,ChatService,
    // { provide: LY_THEME, useClass: MinimaLight, multi: true },
    // { provide: LY_THEME, useClass: MinimaDark, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
