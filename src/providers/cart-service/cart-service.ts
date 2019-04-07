import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/config';
import 'rxjs/add/operator/map';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("_token")
  })
};
/*
  Generated class for the CartServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartServiceProvider {
  public items:any = [];
  public addItem:any = [];
  public cfg: any;

  constructor(public http: HttpClient) {
    console.log('Hello CartServiceProvider Provider');
    this.items = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];
    this.cfg = AppConfig.cfg;
  }

  getSelf() {
    return this;
  }

  getItemIDs() {
    let ids = [];
    this.items.forEach(item=> {
      let id = item.id;
      let qty = item.qty;
      let orderItemId = item.orderItemId;
      let demand = item.demand;
      let remark = item.remark;
      let kitchen_status = item.kitchen_status;
      ids.push({product_id:id, qty:qty, orderItemId:orderItemId, demand:demand, remark:remark, kitchen_status:kitchen_status});
    });

    return ids;
  }

  getItems() {
    return this.items;
  }

  getTotalAmount() {
    let total = 0;
    this.items.forEach(item=> {
      total += (item.qty * item.price);
    });
    return total;
  }

  getTotalCount() {
    return this.items.length;
  }

  getTax() {
    let tax = 0;
    let total = this.getTotalAmount();
    if(total > 0) {
      tax = total * 0.05;
    }

    return tax;
  }

  save() {
    localStorage.setItem("shopping_cart", JSON.stringify(this.items));
  }

  add(item:any) {
    if(this.items.length > 0) {
      let existingItemIndex = null;
      this.items.map((cItem, i)=> {
        if(item.id == cItem.id) {
          existingItemIndex = i;
        }
      });

      if(existingItemIndex != null) {
        this.items[existingItemIndex].qty += 1;
      }else {
        item.qty = 1;
        this.items.push(item);
      }
    }else {
      item.qty = 1;
      this.items.push(item);
    }
    this.save();
    return;
  }

  update(item, mode) {
    let indexToUpdate = null;
    this.items.map((currentItem, index)=> {
      if(currentItem.id == item.id) {
        indexToUpdate = index;
      }
    });

    if(mode == "m") {
      this.items[indexToUpdate].qty -= 1;
    }else if(mode == "p") {
      this.items[indexToUpdate].qty += 1;
    }

    if(this.items[indexToUpdate].qty <= 0) {
      this.items.splice(indexToUpdate, 1);
    }

    this.save();
    return;
  }

  remove(item:any) {
    let indexToDelete = null;
    this.items.map((currentItem, index)=> {
      if(currentItem.id == item.id) {
        indexToDelete = index;
      }
    });

    if(indexToDelete != null) {
      this.items.splice(indexToDelete, 1);
    }

    this.save();
    return;
  }

  removeOrderItem(itemId) {
    let url = this.cfg.apiUrl+"/orders/"+itemId+"/removeitem";
    return this.http.get(url, httpOptions);
  }

  clear() {
    this.items = [];
    this.save();
  }

  submitOrder(orderData) {
    let url = this.cfg.apiUrl+"/orders";
    return this.http.post(url, orderData, httpOptions);
  }

  updateOrder(id, orderData) {
    let url = this.cfg.apiUrl+"/orders/"+id+"/update";
    return this.http.post(url, orderData, httpOptions);
  }

  getAllOrders() {
    let url = this.cfg.apiUrl+"/orders";
    return this.http.get(url, httpOptions);
  }

  getCurrentOrder() {
    let url = this.cfg.apiUrl+"/orders/order";
    return this.http.get(url, httpOptions);
  }

  getSelectOrder(id) {
    let url = this.cfg.apiUrl+"/orders/"+id;
    return this.http.get(url, httpOptions);
  }

  returnAdd(item:any){
    this.items.push(item);
    //persist to localStorage
    this.save();
    return;
  }

  addDemand(setdemand:any) {
    //if the same item is in the cart
    // let existingItemIndex = null;
    this.items.map((cItem,i)=>{
      if(setdemand.itemid == cItem.id){
        this.items[i].demand = setdemand.demand;
        this.items[i].remark = setdemand.remark;
      }
    });

    //persist to localStorage
    this.save();
    return;
  }

  returnAddDemand(setdemand:any) {
    //if the same item is in the cart
    // let existingItemIndex = null;
    this.items.map((cItem,i)=>{
      if(setdemand.itemid == cItem.orderItemId){
        this.items[i].demand = setdemand.demand;
        this.items[i].remark = setdemand.remark;
        this.items[i].kitchen_status = setdemand.kitchen_status;
      }
    });

  //persist to localStorage
  this.save();
  return;
  }

}
