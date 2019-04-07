import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/config';
import 'rxjs/add/operator/map';

/*
  Generated class for the SaleServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class SaleServiceProvider {
  public cfg: any;
  public products: any;

  constructor(public http: HttpClient) {
    console.log('Hello SaleServiceProvider Provider');
    // this.cfg = "http://localhost:3500/api";
    this.cfg = AppConfig.cfg;
  }

  serialize(obj) {
    var str = [];
    for(var p in obj) {
      if(obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }

  getAllProduct(query={}) {
    let qstr = this.serialize(query);
    let url = this.cfg.apiUrl+"/products/pos?"+qstr;
    return this.http.get( url, httpOptions );
  }

  getAllCategory() {
    return this.http.get( this.cfg.apiUrl + this.cfg.categories, httpOptions );
  }

  getAllTable() {
    return this.http.get( this.cfg.apiUrl + this.cfg.tables, httpOptions );
  }

  getAllOrders() {
    let url = this.cfg.apiUrl+"/orders";
    return this.http.get(url, httpOptions);
  }

  getCurrentOrder() {
    let url = this.cfg.apiUrl+"/orders/order";
    return this.http.get(url, httpOptions);
  }

  getImg(img_name) {
    return this.cfg.publicUrl +"uploads/"+img_name;
  }

}
