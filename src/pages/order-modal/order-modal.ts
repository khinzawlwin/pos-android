import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
// import { OrderPage } from '../../pages/order/order';
/**
 * Generated class for the OrderModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-modal',
  templateUrl: 'order-modal.html',
})
export class OrderModalPage {
  public orders: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public cartSvc: CartServiceProvider,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderModalPage');
    this.loadOrders();
  }

  closeOrderModal() {
    this.viewCtrl.dismiss();
  }

  loadOrders() {
    this.cartSvc.getCurrentOrder().subscribe((res:any)=> {
      if(res.orders) {
        this.orders = res.orders;
      }
    });
  }

  openOrder(order) {
    this.cartSvc.clear();
    this.navCtrl.setRoot('OrderPage', {order: order});
  }

}
