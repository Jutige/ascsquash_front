import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthentGuardService} from "./services/authent-guard.service";
import {UserService} from "./services/user-service";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {DialogModalComponent} from "./components/share/dialog-modal/dialog-modal.component";
import {AuthentComponent} from "./components/authent/authent.component";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  {path: 'auth', component:AuthentComponent}
  ];

@NgModule({
  declarations: [
    AppComponent,
    DialogModalComponent,
    AuthentComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FontAwesomeModule
  ],
  providers: [AuthentGuardService,UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
