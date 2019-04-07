import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/config';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
/*
  Generated class for the ReportSerivceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportSerivceProvider {

  public cfg:any;

  constructor(public http: HttpClient) {
    console.log('Hello ReportSerivceProvider Provider');
    this.cfg = AppConfig.cfg;
  }

  serialize(obj) {
    var str= [];
    for (var p in obj) {
     if(obj.hasOwnProperty(p)) {
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
     }
    }
    return str.join("&");
  }

  getSalesTotal(query={}) {
    let qstr = this.serialize(query);
    let url = this.cfg.apiUrl+"/reports/sales-total?"+qstr;
    return this.http.get(url, httpOptions);
  }

  getSalesReport(query={}) {
    let qstr = this.serialize(query);
    let url = this.cfg.apiUrl+"/reports/sales-report?"+qstr;
    return this.http.get(url, httpOptions);
  }

  getSalesDetail(query={}) {
    let qstr = this.serialize(query);
    let url = this.cfg.apiUrl+"/reports/sales-detail?"+qstr;
    return this.http.get(url, httpOptions);
  }

  getSalesQty(query={}) {
    let qstr = this.serialize(query);
    let url = this.cfg.apiUrl+"/reports/sales-qty?"+qstr;
    return this.http.get(url, httpOptions);
  }

  getSalesAllQty(query={}) {
    let qstr = this.serialize(query);
    let url = this.cfg.apiUrl+"/reports/product-qty?"+qstr;
    return this.http.get(url, httpOptions);
  }

  getAllStocks() {
    let url = this.cfg.apiUrl+"/reports/stock-qty";
    return this.http.get(url, httpOptions);
  }

}
