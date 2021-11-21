import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs";
import {InfoResult} from "../models/info-result.model";
import {Info} from "../models/info.model";
import {userMsg} from "../models/user-msg";

const urlInfoList = environment.urlServer + 'v1/info/list';
const urlInfoCreate = environment.urlServer + 'v1/info/create';
const urlInfoUpdate = environment.urlServer + 'v1/info/update';
const urlInfoDelete = environment.urlServer + 'v1/info/delete';

@Injectable({
  providedIn: 'root'
})
export class InfoServiceService {

  public infosSubject = new Subject<InfoResult[]>();
  public infoCreateSubject = new Subject();
  private infosResult: InfoResult[];
  private tokenId = '';

  constructor(private httpClient: HttpClient) { }

  getInfosFromServer() {
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.get<InfoResult[]>(urlInfoList,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log('info.service - getInfosFromServer -> response', response);
          this.infosResult = response.body;
        },
        (error) => {
          console.log('error appel info.service - getInfosFromServer ',error);
        }
      )
  }

  createInfoToServer(infoCreate: Info){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post(urlInfoCreate, infoCreate,
      {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log('info.service - createInfoToServer -> response', response);
          this.infoCreateSubject.next(new userMsg(true, null));
        },
        (error : HttpErrorResponse) => {
          console.log('error appel info.service - getInfosFromServer ',error);
          const errorMsg = 'Erreur appel server, code : ' + error.status;
          this.infoCreateSubject.next(new userMsg(true, errorMsg));
        }
      )
  }
}
