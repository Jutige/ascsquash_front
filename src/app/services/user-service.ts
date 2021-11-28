import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {UserResult} from "../models/user-result.model";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {userMsg} from "../models/user-msg";
import {UserCreate} from "../models/user-create.model";

enum userType {
  userUnkown = 0,
  userNormal,
  userAdmin
}
const urlUserCreate = environment.urlServer + '/v1/user/create';
const urlUserGetList = environment.urlServer + '/v1/user/list';
const urlUserGet = environment.urlServer + '/v1/user/get/';
const urlUserUpdate = environment.urlServer + '/v1/user/update'
const urlUserDelete = environment.urlServer + '/v1/user/delete/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAuth: userType;
  private tokenId: string;
  private userGetSubjectInit = new Subject();
  private userGetSubjectRefresh = new Subject();
  private userGetSubjectDetail = new Subject();
  private usersSubject = new Subject<UserResult[]>();
  public userSubject = new Subject<userType>();
  private userUpdatePasswordSubject = new Subject();
  public userDeleteSubject = new Subject();
  public userCreateSubject = new Subject();
  public userGetSubjectModify = new Subject();
  public userUpdateSubject = new Subject();

  private users: UserResult[] = null;

  private userGet: UserResult = null;
  constructor(private httpClient: HttpClient) {

  }
  getCurrentRole(){
    return this.userAuth;
  }

  GetUserFromServerById(userId: string, caller: number){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    // console.log('valeur de token', this.tokenId);
    this.httpClient.get<UserResult>(urlUserGet + userId,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response : HttpResponse<UserResult>) => {
          //appel après refresh
          if (caller == 0){
            this.userGetSubjectRefresh.next(response);
          }
          //appel après authentification
          if (caller == 1){
            this.userGetSubjectInit.next(response);
          }
          //appel dans le détail utilisateur
          if (caller == 2){
            this.userGetSubjectDetail.next(response);
          }
          //appel dans l'écran modification user
          if (caller == 3){
            this.userGetSubjectModify.next(response);
          }

          console.log('user.service - GetUserFromServerById -> response', response);
          this.userGet = response.body;
        },
        (error) => {
          // this.userGetSubject.next(error);
          console.log('user.service - GetUserFromServerById -> Error', error);
        }
      );
  }

  getUsersFromServer(){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.get<any[]>(urlUserGetList,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log('header', response.headers.keys());
          console.log('count', response.headers.get('count'));
          this.users = response.body;
          this.getRoles();
          this.usersSubject.next(response.body);
        },
        (error) => {
          console.log('erreur back-end ', error );
        }
      );
  }

  deleteUserToServer(userResult: UserResult) {
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.delete(urlUserDelete + userResult.idAsc,
      {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response: any) => {
          console.log('Maj back-end Ok');
          console.log(response);
          this.userDeleteSubject.next(new userMsg(true, null));
        },
        (error: HttpErrorResponse) => {
          console.log('Maj back-end Ko' + error );
          if (error.status === 200 || error.status === 201) {
            this.userDeleteSubject.next(new userMsg(true, null));
          } else {
            const msg = this.errorHandler(error);
            this.userDeleteSubject.next(new userMsg(false, msg));
          }
        }
      );
  }

  createUser(userCreate: UserCreate){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post(urlUserCreate, userCreate,
      {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response: any) => {
          console.log('Maj back-end Ok');
          console.log(response);
          this.userCreateSubject.next(new userMsg(true, null));
        },
        (error: HttpErrorResponse) => {
          console.log('Maj back-end Ko' + error );
          if (error.status === 200 || error.status === 201) {
            this.userCreateSubject.next(new userMsg(true, null));
          } else {
            const msg = this.errorHandler(error);
            this.userCreateSubject.next(new userMsg(false, msg));
          }
        }
      );
  }

  updateUser(userCreate: UserCreate){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post(urlUserUpdate, userCreate,
      {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response: any) => {
          console.log('Maj back-end Ok');
          console.log(response);
          this.userUpdateSubject.next(new userMsg(true, null));
        },
        (error: HttpErrorResponse) => {
          console.log('Maj back-end Ko' + error );
          if (error.status === 200 || error.status === 201) {
            this.userUpdateSubject.next(new userMsg(true, null));
          } else {
            const msg = this.errorHandler(error);
            this.userUpdateSubject.next(new userMsg(false, msg));
          }
        }
      );
  }

  updatePasswordToServer(userId: string, oldPassword: string, newPassword: string){
/*    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.put(urlUserUppassword + userId + '/' + oldPassword + '/' + newPassword, null,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          this.userUpdatePasswordSubject.next(response);
        },
        (error) => {
          this.userUpdatePasswordSubject.next(error);
          console.log('erreur back end', error);
        }
      );*/
  }

  getRoles(){
    for (let userList of this.users) {
      this.getRole(userList);
    }
  }

  getUserGetRefreshSubject(){
    return this.userGetSubjectRefresh;
  }

  getUserGetInitSubject(){
    return this.userGetSubjectInit;
  }
  getUserGetDetailSubject(){
    return this.userGetSubjectDetail;
  }

  getUpdatePasswordSubject(){
    return this.userUpdatePasswordSubject;
  }
  getUserDeleteSubject() {
    return this.userDeleteSubject;
  }

  getRole(userList: UserResult): UserResult {
    console.log('get role user service');
    for (let index in userList.roles) {
      if (userList.roles[index] === 'ROLE_USER') {
        userList.roles[index] = 'Utilisateur';
      }
      if (userList.roles[index] === 'ROLE_ADMIN') {
        userList.roles[index] = 'Administrateur';
      }
    }
    console.log('userList', userList);
    return userList;
  }

  updateRole(roleChosen: userType) {
    this.userAuth = roleChosen;
    // méthode suivante nécessaire pour les components qui ecoutent la maj du role
    this.userSubject.next(roleChosen);
  }

  getUsers(): UserResult[]{
    return this.users;
  }

  getusersSubject() {
    return this.usersSubject;
  }

  errorHandler(error: HttpErrorResponse): string {
    //
    // these case below are handled by the back-end, so we just return the error msg formatted by the back
    if (error.status === 409) {
      // conflict during the update server with other user
      return 'Un autre utilisateur a mis à jour le système entre temps.' +
        'Veuillez ressayer. ('  + error.error.message + ')';
    }
    if (error.status === 400) {
      // the request has a correct syntax but bad values (validation control of the field
      // like sip, email, size of fields)
      return 'Données saisies incorrectes. (' + error.error.message + ')';
    }
    if (error.status === 304) {
      // the request has a incorrect syntax but because of the front, not the user : serious error
      return 'Incohérence des données envoyées. Contactez la responsable ASC. (' + error.error.message + ')';
    }
    if (error.status === 404) {
      // the request has a incorrect syntax but because of the front, not the user : serious error
      const msg = error.error.message;
      return 'Incohérence des données en base. Contactez la responsable ASC. (' + msg + ')';
    }

    return 'Contactez la MOE. Erreur interne (' + error.status + ')';
  }
}
