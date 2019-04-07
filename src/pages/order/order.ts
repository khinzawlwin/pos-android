import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';
import { SaleServiceProvider } from '../../providers/sale-service/sale-service';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { AuthProvider } from '../../providers/auth/auth';
import { KitchenProvider } from '../../providers/kitchen/kitchen';
import { HomePage } from '../../pages/home/home';
import { KitchenDisplayPage } from '../../pages/kitchen-display/kitchen-display';
import { ReportPage } from '../../pages/reports/report/report';
import { PrintPage } from '../../pages/print/print';
// import { PrintProvider } from '../../providers/print/print';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  public products: any;
  public categories: any;
  public tables: any;
  public vId: any;
  public order: any = {};
  public currentOrderCount: any;
  public query: any = {
    category: ''
  };
  public getOrder: any = {};
  public items: any;
  public countItem: any;
  public custName: any;
  public tblName: any;
  public readyCount: any;
  public cust_demands: any;
  public setdemand: any = {
    itemid: '',
    demand: '',
    remark: '',
    kitchen_status: '',
  };
  public taxCheck: boolean = false;
  public isCheckTax:boolean;
  public user:any;
  public orderService:any;
  public chkByOne:boolean = false;
  public chkItemValue:any = {};
  public byOne:boolean = false;

  public selectedPrinter:any=[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public saleSvc: SaleServiceProvider,
    public cartSvc: CartServiceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public kitSvc: KitchenProvider,
    public authSvc: AuthProvider,
    // private printProvider:PrintProvider,
  ) {
    this.chkItemValue = localStorage.getItem("checkItem") ? JSON.parse(localStorage.getItem("checkItem")) : [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.getOrder = this.navParams.get('order');
    if(this.authSvc.isLoggedIn()) {
      this.user = this.authSvc.user();
    }
    console.log(this.user.role);
    this.taxCheck = false;
    this.loadCategory();
    this.loadTables();
    this.loadProducts();
    this.getVId();
    this.loadSelectOrder(this.getOrder.id);
    this.loadOrderService(this.getOrder.id);
    this.getOrderCount();
    this.updateValue();
    this.kitchenReady();
  
      setInterval(() => { 
        this.kitchenReady();
        this.getOrderCount();
        this.loadOrderService(this.getOrder.id);
      }, 2000);

  }

  closeOrder() {
    this.cartSvc.clear();
    this.viewCtrl.dismiss();
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
    this.saleSvc.getAllProduct(this.query).subscribe((res:any)=> {
      this.products = res.products;
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
    if(this.isCheckTax == false) {
      this.order.tax = 0;
      this.order.total_amount = this.cartSvc.getTotalAmount();
      this.order.paid_amount = this.cartSvc.getTotalAmount();
      this.order.change_amount = 0;
      this.order.balance_amount = this.cartSvc.getTotalAmount();
    }else {
      this.order.tax = this.cartSvc.getTax();
      this.order.total_amount = this.cartSvc.getTotalAmount() +  this.cartSvc.getTax();
      this.order.paid_amount = this.cartSvc.getTotalAmount() +  this.cartSvc.getTax();
      this.order.change_amount = 0;
      this.order.balance_amount = this.cartSvc.getTotalAmount() +  this.cartSvc.getTax();
    }
  }

  loadSelectOrder(id:any) {
    this.cartSvc.getSelectOrder(id).subscribe((res:any)=> {
      if(res.order) {
        this.order = res.order;
        this.custName = res.order.Customer.name;
        this.tblName = res.order.Table.name;
        this.items = res.items;
        this.countItem = res.countItem;
        this.cust_demands = res.cust_demands;
        
        if(this.cartSvc.getItems().length < this.countItem) {
          this.items.map((item, i)=> {
            let addItem = item.Product;
            addItem.qty = item.qty;
            addItem.orderItemId = item.id;
            this.cartSvc.returnAdd(addItem);
          });

          this.cust_demands.map((setdemand, i)=> {
            this.setdemand.itemid = setdemand.sale_item_id;
            this.setdemand.demand = setdemand.cust_demand;
            this.setdemand.remark = setdemand.remark;
            this.setdemand.kitchen_status = setdemand.kitchen_status;
            this.cartSvc.returnAddDemand(this.setdemand);
          });
        }

        this.order.total_amount = this.cartSvc.getTotalAmount();
        this.order.paid_amount = this.cartSvc.getTotalAmount();
        this.order.balance_amount = this.cartSvc.getTotalAmount();

        if(this.order.remark == 'byOne') {
          this.byOne = true;
          this.chkByOne = true;
        }

        if(this.order.tax == 0) {
          this.taxCheck = false;
          this.isCheckTax = false;
        }else {
          this.taxCheck = true;
          this.isCheckTax = true;
        }
      }
    });
  }

  loadOrderService(id:any) {
    this.cartSvc.getSelectOrder(id).subscribe((res:any)=> {
      if(res.order) {
        this.orderService = res.cust_demands.length;
      }
    });
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
    this.cartSvc.removeOrderItem(item.orderItemId).subscribe((res:any)=> {
      if(res.orderItem) {
        console.log(res.message);
      }
    });
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
        cssClass: 'normal-toast',
        duration: 2000,
      });
      toast.present();
    }else {
      let id = this.order.id;
      let formData = {};

      if(this.chkByOne == false) {
        formData = {
          customer_id: 1,
          table_id: this.order.table_id,
          voucher_no: this.order.voucher_no,
          subtotal: this.cartSvc.getTotalAmount(),
          discount_amount: this.order.discount_amount,
          tax: this.order.tax,
          total_amount: this.order.total_amount,
          paid_amount: this.order.paid_amount,
          change_amount: this.order.change_amount,
          balance_amount: this.order.balance_amount,
          status: s,
          items: this.cartSvc.getItemIDs()
        };
      }else {
        formData = {
          by_one: 'byOne',
          table_id: this.order.table_id,
          item_id: this.getChkItemIDs(),
          status: s,
        };
      }
      
      // console.log(formData);
      this.cartSvc.updateOrder(id, formData).subscribe((res:any)=> {
        console.log(res.order);
        if(res.order) {
          //clear shopping cart
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
          // Check By One
          this.chkItemValue = [];
          this.save();
          this.byOne = false;
          this.chkByOne = false;
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

  kitchenReady() {
    this.kitSvc.getKitchenOrders().subscribe((res:any)=> {
      if(res.kitchenOrders) {
        this.readyCount = res.kitchenOrders.length;
      }
    });
  }

  openKitchen(page) {
    this.navCtrl.push(KitchenDisplayPage);
  }

  openReport() {
    this.navCtrl.push(ReportPage);
  }

  getByOne(value:any) {
    this.chkByOne = value.checked;
    if(this.chkByOne == false) {
      this.chkItemValue = [];
    }
  }

  chkItem(event:any, item:any) {
    let chk = event.checked;
    if(chk == true) {
      this.chkItemValue.push(item);

    }else {

      let indexToDelete = null;
      this.chkItemValue.map((currentItem, index)=>{
        if(currentItem.id == item.id) {
          indexToDelete = index;
        }
      });
  
      if(indexToDelete != null) {
        this.chkItemValue.splice(indexToDelete, 1);
      }  
    }

    this.save();
    return;
  }

  save(){
    localStorage.setItem("checkItem", JSON.stringify(this.chkItemValue));
  }

  getChkItem() {
    return this.chkItemValue;
  }

  getChkItemIDs(){
    let ids = [];

    this.chkItemValue.forEach ( item => {
      let orderItemId = item.orderItemId;
      ids.push({orderItemId:orderItemId});
    });

    return ids;
  }

  openPrint() {
    let data = this.order;
    this.navCtrl.push(PrintPage, {data:data});
  }

}
