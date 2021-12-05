import { NgModule } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
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
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {UserAccountComponent} from "./components/user/user-account/user-account.component";
import {UserListComponent} from "./components/user/user-list/user-list.component";
import {UserListItemComponent} from "./components/user/user-list-item/user-list-item.component";
import { InfoListComponent } from './components/info/info-list/info-list.component';
import { InfoListItemComponent } from './components/info/info-list-item/info-list-item.component';
import {InfoService} from "./services/info-service";
import { UserDetailComponent } from './components/user/user-detail/user-detail/user-detail.component';
import { UserCreateComponent } from './components/user/user-create/user-create/user-create.component';
import { UserModifyComponent } from './components/user/user-modify/user-modify.component';
import { InfoDetailComponent } from './components/info/info-detail/info-detail.component';
import { InfoModifyComponent } from './components/info/info-modify/info-modify.component';
import { InfoCreateComponent } from './components/info/info-create/info-create.component';
import {HttpErrorInterceptor} from "./inteceptor/HttpErrorInterceptor";

const appRoutes: Routes = [
  {path: 'auth', component: AuthentComponent},
  {path: 'infos', component: InfoListComponent},
  {path: 'infos/create/createInfo', component: InfoCreateComponent},
  {path: 'infos/:idInfo', component: InfoDetailComponent},
  {path: 'infos/modify/:idInfo', component: InfoModifyComponent},
  {path: 'users', component: UserListComponent},
  {path: 'users/:idUser', component: UserDetailComponent},
  {path: 'users/create/createUser', component: UserCreateComponent},
  {path: 'users/modify/:idUser', component: UserModifyComponent},
  {path: 'account', component: UserAccountComponent}
  ];

@NgModule({
  declarations: [
    AppComponent,
    DialogModalComponent,
    AuthentComponent,
    UserAccountComponent,
    UserListComponent,
    UserListItemComponent,
    InfoListComponent,
    InfoListItemComponent,
    UserDetailComponent,
    UserCreateComponent,
    UserModifyComponent,
    InfoDetailComponent,
    InfoModifyComponent,
    InfoCreateComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FontAwesomeModule,
    NgxEditorModule
  ],
  providers: [AuthentGuardService,UserService,
    InfoService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
