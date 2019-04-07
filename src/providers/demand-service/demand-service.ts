import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
/*
  Generated class for the DemandServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DemandServiceProvider {

  public cfg:any;

  constructor(public http: HttpClient) {
    console.log('Hello DemandServiceProvider Provider');
    this.cfg = AppConfig.cfg;
  }

  getAllDemand() {
    let url = this.cfg.apiUrl+"/customer-demands";
    return this.http.get(url, httpOptions);
  }

}
