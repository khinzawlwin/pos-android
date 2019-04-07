import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { KitchenProvider } from '../../providers/kitchen/kitchen';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';
import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the KitchenDisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kitchen-display',
  templateUrl: 'kitchen-display.html',
})
export class KitchenDisplayPage {

  public kitchenOrders: any;
  public userRole: any;
  public kitchens: any;
  public orderCount: any;
  public currentOrderCount: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public kitSvc: KitchenProvider,
    public authSvc: AuthProvider,
    private localNotifications: LocalNotifications,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KitchenDisplayPage');
    if(this.authSvc.isLoggedIn()) {
      this.userRole = this.authSvc.user();
      this.loadOrders();
      this.loadNotiSound();

      setInterval(() => { 
        this.loadOrders(); 
      }, 2000);
    }

    this.loadKitchen();

  }

  loadNotiSound() {
    this.kitSvc.getKitchenOrders().subscribe((res:any)=> {
      if(res.kitchenOrders) {
        this.orderCount = res.kitchenOrders.length + 1;
      }
    });
  }

  setSound() {
    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'Delayed ILocalNotification',
      led: 'FF0000',
      sound: 'file://assets/sound/samsung_galaxy_alarm.mp3',
    });
  }

  loadOrders() {
    this.kitSvc.getKitchenOrders().subscribe((res:any)=> {
      if(res.kitchenOrders) {
        let order:any = "";
        this.kitchenOrders = res.kitchenOrders;
        this.currentOrderCount = res.kitchenOrders.length;
        res.kitchenOrders.map((order, i)=> {
          order.no = i+1;
        });
        this.kitchenOrders.push(order);
      }

      if(this.currentOrderCount > this.orderCount ) {
        this.setSound();
        // console.log('kitchentesting:'+res.kitchenOrders.length, this.orderCount);
        this.orderCount = this.currentOrderCount;
      }
    });
  }

  loadKitchen() {
    this.kitSvc.getAll().subscribe((res:any)=> {
      if(res.kitchens) {
        this.kitchens = res.kitchens;
      }
    });
  }

  kitchenReady(id) {
    this.kitSvc.updateKitchenStatus(id).subscribe((res:any)=> {
      if(res.kitchenOrder) {
        this.loadOrders();
      }
    });

  }
  waiterConfirm(id) {
    this.kitSvc.updateWaiterStatus(id).subscribe((res:any)=> {
      if(res.kitchenOrder) {
        this.loadOrders();
      }
    });
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

  pageRefresh() {
    // this.navCtrl.setRoot(KitchenDisplayPage);
    location.reload();
  }

}
