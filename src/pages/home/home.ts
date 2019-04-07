import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { SaleServiceProvider } from '../../providers/sale-service/sale-service';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { AuthProvider } from '../../providers/auth/auth';
import { KitchenProvider } from '../../providers/kitchen/kitchen';
import { LoginPage } from '../../pages/login/login';
import { KitchenDisplayPage } from '../../pages/kitchen-display/kitchen-display';
import { ReportPage } from '../../pages/reports/report/report';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public products: any;
  public categories: any;
  public tables: any;
  public vId:any;
  public order:any = {};
  public currentOrderCount: any;
  public query:any = {
    category: ''
  };
  public user:any;
  public readyCount: any;
  public beforeReadyCount: any;
  public taxCheck: boolean = false;
  public isCheckTax:boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public saleSvc: SaleServiceProvider,
    public cartSvc: CartServiceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public authSvc: AuthProvider,
    public kitSvc: KitchenProvider,
    private localNotifications: LocalNotifications,
  ) {
    this.order.table_id = 0;
  }

  ionViewWillEnter() {

    if(!this.authSvc.isLoggedIn()) {
      this.navCtrl.setRoot(LoginPage);
    }

    if(this.authSvc.isLoggedIn()) {
      this.user = this.authSvc.user();
      if(this.user.role == 5) {
        this.navCtrl.setRoot(KitchenDisplayPage);
      }
      console.log(this.user);

      this.cartSvc.clear();
      
      this.loadCategory();
      this.loadTables();
      this.loadProducts();
      this.getVId();
      this.getOrderCount();
      this.updateValue();
      this.kitchenReady();
      this.beforeKitchenReady();
  
      setInterval(() => { 
        this.kitchenReady();
        this.getOrderCount();
      }, 2000);
    }

  }

  loadTables() {
    this.saleSvc.getAllTable().subscribe((res:any)=> {
      if(res.tables) {
        this.tables = res.tables;
      }
    });
  }

  loadCategory() {
    this.saleSvc.getAllCategory().subscribe((res:any)=> {
      if(res.categories) {
        this.categories = res.categories;
      }
    });
  }

  loadProducts() {
		let loading = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: 'circles',
      //dismissOnPageChange: true
    });
    loading.present(loading);

    this.saleSvc.getAllProduct(this.query).subscribe((res:any)=> {
      if(res.products) {
        this.products = res.products;
      }
      setTimeout(() => {
        loading.dismiss();
      }, 500);
      
    },(res:any)=> {
      loading.dismiss();
		  console.error('Error Fetching Products!', res);
    });
  }

  getVId() {
    this.cartSvc.getAllOrders().subscribe((res:any)=> {
      if(res.orders) {
        let num = res.orders.length + 1;
        this.vId = String("00000000" + num).slice(-8);
      }
    });
  }

  onFilter($event) {
    this.query.category = $event;
    this.loadProducts();
  }

  updateValue() {
    if(this.taxCheck == false) {
      this.order.discount_amount = 0;
      this.order.tax = 0;
      this.order.total_amount = this.cartSvc.getTotalAmount();
      this.order.paid_amount = this.cartSvc.getTotalAmount();
      this.order.change_amount = 0;
      this.order.balance_amount = this.cartSvc.getTotalAmount();
    }else {
      this.order.discount_amount = 0;
      this.order.tax = this.cartSvc.getTax();
      this.order.total_amount = this.cartSvc.getTotalAmount() +  this.cartSvc.getTax();
      this.order.paid_amount = this.cartSvc.getTotalAmount() +  this.cartSvc.getTax();
      this.order.change_amount = 0;
      this.order.balance_amount = this.cartSvc.getTotalAmount() +  this.cartSvc.getTax();
    }
  }

  addToCart(product) {
    this.cartSvc.add(product);

    this.updateValue();
  }

  updateQtyCart(item, mode) {
    this.cartSvc.update(item, mode);
    this.updateValue();
  }

  removeItemCart(item) {
    this.cartSvc.remove(item);
    this.updateValue();
  }

  reset() {
    this.cartSvc.clear();
    this.navCtrl.setRoot(HomePage);
  }

  numOnly(event:any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  discountCal() {
    let discount = (this.cartSvc.getTotalAmount()*this.order.discount_amount)/100;
    let tax = 0;
    if(this.taxCheck == false) {
      tax = 0;
    }else {
      tax = (this.cartSvc.getTotalAmount() - discount) * 0.05;
    }
    this.order.tax = Math.round(tax);
    this.order.total_amount = Math.round((this.cartSvc.getTotalAmount() - discount) + tax);
    this.order.paid_amount =  Math.round((this.cartSvc.getTotalAmount() - discount) + tax);
    this.order.balance_amount =  Math.round((this.cartSvc.getTotalAmount() - discount) + tax);
  }

  paidamountCal() {
    this.order.change_amount = this.order.paid_amount - this.order.total_amount;
    this.order.balance_amount = this.order.paid_amount - this.order.change_amount;
  }

  changeamountCal() {
    this.order.balance_amount = this.order.paid_amount - this.order.change_amount;
  }

  taxOnOff(value: any) {
    this.taxCheck = value.checked;

    let discount = (this.cartSvc.getTotalAmount()*this.order.discount_amount)/100;
    let tax = 0;
    if(this.taxCheck == true) {
      tax = (this.cartSvc.getTotalAmount() - discount) * 0.05;
    }else {
      tax = 0;  
    }
    this.order.tax = Math.round(tax);
    this.order.total_amount = Math.round((this.cartSvc.getTotalAmount() - discount) + tax);
    this.order.paid_amount =  Math.round((this.cartSvc.getTotalAmount() - discount) + tax);
    this.order.balance_amount =  Math.round((this.cartSvc.getTotalAmount() - discount) + tax);
  }

  onOrderSubmit(s) {
    if(this.order.table_id == 0) {
      const toast =  this.toastCtrl.create({
        message: 'Please Require Select Table!',
        cssClass: 'toast-warning',
        position: 'bottom',
        duration: 2000,
      });
      toast.present();
    }else {
      let formData = {
        customer_id: 1,
        table_id: this.order.table_id,
        voucher_no: this.vId,
        subtotal: this.cartSvc.getTotalAmount(),
        discount_amount: this.order.discount_amount,
        tax: this.order.tax,
        total_amount: this.order.total_amount,
        paid_amount: this.order.paid_amount,
        change_amount: this.order.change_amount,
        balance_amount: this.order.balance_amount,
        sale_by: this.user.id,
        status: s,
        items: this.cartSvc.getItemIDs()
      };

      console.log(formData);
      this.cartSvc.submitOrder(formData).subscribe((res:any)=> {
        console.log(res.order);
        if(res.order) {
          
          this.cartSvc.clear();
  
          this.order.discount_amount = 0;
          this.order.tax = 0;
          this.order.total_amount = 0;
          this.order.paid_amount = 0;
          this.order.change_amount = 0;
          this.order.balance_amount = 0;
          this.order.table_id = 0;
          this.order.customer_id = 1;
  
          this.getVId();
          //redirect to pos
          this.navCtrl.setRoot(HomePage);
        }
      });
    }
  }

  getOrderCount() {
    this.cartSvc.getCurrentOrder().subscribe((res:any)=> {
      if(res.orders) {
        this.currentOrderCount = res.orders.length;
      }
    });
  }

  async openOrderModal() {
    let data = {message: "Hello World"};
    let orderModal = await this.modalCtrl.create('OrderModalPage', data);
    await orderModal.present();
  }

  async openDemandModal(id, demand, remark) {
    let data = {
      itemid: id,
      demand: demand,
      remark: remark
    };
    let demandModal = await this.modalCtrl.create('DemandModelPage', data);
    await demandModal.present();
  }

  onLogout(e) {
    // alert("logout");
    var confm = confirm("Are you sure to logout?");
    if(confm) {
      this.authSvc.logOut().subscribe(res=>{
        this.navCtrl.setRoot(LoginPage);
      });
    }
  }

  kitchenReady() {
    this.kitSvc.getKitchenOrders().subscribe((res:any)=> {
      if(res.kitchenOrders) {
        this.readyCount = res.kitchenOrders.length;
      }
      if(this.readyCount > this.beforeReadyCount ) {
        this.setSound();
        // console.log('testing: '+res.kitchenOrders.length, this.beforeReadyCount);
        this.beforeReadyCount = this.readyCount;
      }
    });
  }

  beforeKitchenReady() {
    this.kitSvc.getKitchenOrders().subscribe((res:any)=> {
      if(res.kitchenOrders) {
        this.beforeReadyCount = res.kitchenOrders.length;
      }
    });
  }

  setSound() {
    this.localNotifications.schedule({
      text: 'Delayed ILocalNotification',
      led: 'FF0000',
      sound: 'file://sound/samsung_galaxy_alarm.mp3',
    });
  }

  openKitchen(page) {
    this.navCtrl.push(KitchenDisplayPage);
  }

  openReport() {
    this.navCtrl.push(ReportPage);
  }

}
