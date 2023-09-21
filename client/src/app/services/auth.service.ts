import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { apiUrls } from '../api.urls';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    http = inject(HttpClient);
    isLoggedIn$ = new BehaviorSubject<boolean>(false);

  register(registerObj  :any){
    return this.http.post<any>(`${apiUrls.authServiceApi}register`, registerObj);
  }

  login(loginObj : any){
    return  this.http.post<any>(`${apiUrls.authServiceApi}login`, loginObj);
  }

  sendEmail(email : string){
    return  this.http.post<any>(`${apiUrls.authServiceApi}send-email`, {email : email});
  }

  resetPassword(resetObj : any){
    return  this.http.post<any>(`${apiUrls.authServiceApi}reset-password`, resetObj);
  }

  isLoggedIn(){
    return !!localStorage.getItem('user_id'); // !! - means if user_id exists it will return true or else it will return false
  }
}
