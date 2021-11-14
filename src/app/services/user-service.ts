import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {UserResult} from "../models/user-result.model";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

enum userType {
  userUnkown = 0,
  userNormal,
  userAdmin
}
const urlUserGetList = environment.urlServer + '/v1/user/list';
const urlUserGet = environment.urlServer + '/v1/user/get/';
const urlUserDelete = environment.urlServer + '/v1/user/delete/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAuth: userType;
  private tokenId: string;
  private userGetSubject = new Subject();
  public userSubject = new Subject<userType>();

  private userGet: UserResult = null;
  constructor(private httpClient: HttpClient) {

  }
  getCurrentRole(){
    return this.userAuth;
  }

  GetUserFromServerById(userId: string){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    // console.log('valeur de token', this.tokenId);
    this.httpClient.get<UserResult>(urlUserGet + userId,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response : HttpResponse<UserResult>) => {
          this.userGetSubject.next(response);
          console.log('user.service - GetUserFromServerById -> response', response);
          this.userGet = response.body;
        },
        (error) => {
          // this.userGetSubject.next(error);
          console.log('user.service - GetUserFromServerById -> Error', error);
        }
      );
  }

  getGetSubject(){
    return this.userGetSubject;
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
}
