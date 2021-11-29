import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject} from "rxjs";
import {InfoResult} from "../models/info-result.model";
import {Info} from "../models/info.model";
import {userMsg} from "../models/user-msg";

const urlInfoList = environment.urlServer + '/v1/info/list';
const urlInfoGet = environment.urlServer + '/v1/info/get/';
const urlInfoCreate = environment.urlServer + '/v1/info/create';
const urlInfoUpdate = environment.urlServer + '/v1/info/update';
const urlInfoDelete = environment.urlServer + '/v1/info/delete/';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private infosResult: InfoResult[];
  private infoResult: InfoResult;
  public infosSubject = new Subject<InfoResult[]>();
  public infoGetSubject = new Subject<InfoResult>();
  public infoDeleteSubject = new Subject<String>();
  public infoDeleteErrorSubject = new Subject<Number>();
  public infoCreateSubject = new Subject<InfoResult>();
  public infoCreateErrorSubject = new Subject<Number>();
//  public infoGetListSubject = new Subject();
  private tokenId = '';

  constructor(private httpClient: HttpClient) { }

  getInfosFromServer() {
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.get<any[]>(urlInfoList,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log('info.service - getInfosFromServer -> response', response);
          this.infosResult = response.body;
          this.infosSubject.next(response.body);
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
        (response: any) => {
          console.log('info.service - createInfoToServer -> response', response);
          this.infoCreateSubject.next(response.body);
        },
        (error : HttpErrorResponse) => {
          console.log('error appel info.service - getInfosFromServer ',error);
          const errorMsg = 'Erreur appel server, code : ' + error.status;
          this.infoCreateErrorSubject.next(error.status);
        }
      )
  }
  deleteInfoToserver(idInfo: bigint){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.delete(urlInfoDelete+idInfo,
      {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response: any) => {
          console.log('info.service - deleteInfoToserver -> response', response);
          this.infoDeleteSubject.next(response.body);
        },
        (error : HttpErrorResponse) => {
          console.log('error appel info.service - getInfosFromServer ',error);
          const errorMsg = 'Erreur appel server, code : ' + error.status;
          this.infoDeleteErrorSubject.next(error.status);
        }
      )
  }

  getInfoById(idInfo: bigint){
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.get<any>(urlInfoGet+idInfo,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log('info.service - getInfosFromServer -> response', response);
          this.infoResult = response.body;
          this.infoGetSubject.next(response.body);
        },
        (error) => {
          console.log('error appel info.service - getInfosFromServer ',error);
        }
      )
  }
}
