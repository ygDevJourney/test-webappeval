import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  loginAPI(email: string, password: string) {
    let payload = {
      emailId: email,
      password: password,
      source: "webApp"
    }
    return this.http.put(environment.baseURL + "users/logIn", payload);
  }

  signupAPI(payload: any) {
    return this.http.post(environment.baseURL + "users/signUp", payload);
  }

  forgotPasswordAPI(email: string){
    return this.http.post(environment.baseURL + "users/forgotPassword", {emailId: email});
  }
}