import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UserService} from "../services/user-service";
import {userMsg} from "../models/user-msg";
import {catchError, map, Observable, throwError} from "rxjs";
import {TechnicalService} from "../services/technical.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {


  constructor(private userService: UserService,
              private technicalService: TechnicalService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('Interceptor - Event: ', event);
              console.log('Interceptor - requete response', request);
            }
            return event;
          }
        ),
        catchError((error: HttpErrorResponse) => {

          console.log('Interceptor - Error: ', error);
          if (request.method === 'GET') {
            console.log('Methode GET en erreur');
            // if (error.status !== 200) {
            //   this.technicalService.getErrorSubject.next(new userMsg(false, error.status.toString()));
            // }
          }
          console.log('Interceptor - requete response error', request);
          if (error.status !== 401) {
            console.log('Interceptor - Error: ', error.status);
          } else {
            if (localStorage.getItem('token')){
              console.log('connexion dépassée, on déconnecte');
              localStorage.clear();
            }
            this.userService.updateRole(0);
          }
          return throwError(error);
        })
      );
  }
}
