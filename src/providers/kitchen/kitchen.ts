import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/config';
import { AuthProvider } from '../../providers/auth/auth';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("_token")
  })
};
/*
  Generated class for the KitchenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class KitchenProvider {
  
  public cfg: any;
  public authUser:any;

  constructor(
    public http: HttpClient,
    public authSvc: AuthProvider,
  ) {
    console.log('Hello KitchenProvider Provider');
    this.cfg = AppConfig.cfg;
  }

  getAll() {
    let url = this.cfg.apiUrl+"/kitchens";
    return this.http.get(url, httpOptions);
  }

  getKitchenOrders() {
    this.authUser = this.authSvc.user();
    let url:any = "";
    if(this.authSvc.isLoggedIn()) {
      if(this.authUser.role == 5) {
        url = this.cfg.apiUrl+"/kitchen-orders/kitchen-view";
      }else if(this.authUser.role == 4) {
        url = this.cfg.apiUrl+"/kitchen-orders/waiter-view";
      }else {
        url = this.cfg.apiUrl+"/kitchen-orders/normal-view";
      }
    }
    
    return this.http.get(url, httpOptions);
  }

  updateKitchenStatus(id) {
    let url = this.cfg.apiUrl+"/kitchen-orders/"+id+"/kitchen-ready";
    return this.http.get(url, httpOptions);
  }

  updateWaiterStatus(id) {
    let url = this.cfg.apiUrl+"/kitchen-orders/"+id+"/waiter-confirm";
    return this.http.get(url, httpOptions);
  }

}
