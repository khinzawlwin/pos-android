import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/config';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("_token")
  })
};
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public cfg:any;
  
  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
    this.cfg = AppConfig.cfg;
  }

  login(data) {
    let url = this.cfg.apiUrl+"/auth/login";
    return this.http.post(url, data, httpOptions);
  }

  refreshToken() {
    let url = this.cfg.apiUrl+"/auth/refresh";
    return this.http.post(url, {}, httpOptions);
  }

  saveUser(user, token) {
    localStorage.setItem("_user", JSON.stringify(user));
    localStorage.setItem("_token", token);
  }

  user() {
    let user = localStorage.getItem("_user");
    if(user) {
      user = JSON.parse(user);
      return user;
    }
  }

  getProfile(){
    let url = this.cfg.apiUrl+"/auth/account";
    return this.http.get(url, httpOptions);
  }

  updateProfile(formData){
    let url = this.cfg.apiUrl+"/auth/account";
    return this.http.put(url, formData, httpOptions);
  }

  isLoggedIn() {
    let token = localStorage.getItem("_token");
    return token ? true: false;
  }

  logOut() {
    localStorage.removeItem("_token");
    localStorage.removeItem("_user");
    let url = this.cfg.apiUrl+"/auth/logout";
    return this.http.post(url, {}, httpOptions);
  }

}
