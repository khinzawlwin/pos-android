import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrderModalPage } from '../pages/order-modal/order-modal';
import { OrderPage } from '../pages/order/order';
import { KitchenDisplayPage } from '../pages/kitchen-display/kitchen-display';
import { DemandModelPage } from '../pages/demand-model/demand-model';
import { AuthProvider } from '../providers/auth/auth';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  // rootPage:any = LoginPage;

  pages: Array<{title: string, component: any, method?: any}>;
  private idToken: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public authSvc: AuthProvider,
    private storage: Storage,
  ) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.storage.get('id_token').then(token => {
      this.idToken = token;
      if(token == null) {
        this.pages = [
          { title: 'Home', component: HomePage },
          { title: 'Login', component: LoginPage },
          { title: 'Order Modal', component: OrderModalPage},
          { title: 'Order', component: OrderPage},
          { title: 'Kitchen Display', component: KitchenDisplayPage},
          { title: 'Demand Modal', component: DemandModelPage},
        ];
      }
      if(token != null ) {
        this.pages = [
          { title: 'Home', component: HomePage },
          { title: 'Login', component: LoginPage },
          { title: 'Order Modal', component: OrderModalPage},
          { title: 'Order', component: OrderPage},
          { title: 'Kitchen Display', component: KitchenDisplayPage},
          { title: 'Demand Modal', component: DemandModelPage},
          { title: 'Logout', component: HomePage, method: 'Logout'}
        ];
      }
      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.method && page.method === 'Logout') {
      this.authSvc.logOut().subscribe(res=>{
        this.nav.setRoot(LoginPage);
      });
    }

    this.nav.setRoot(page.component);
  }
}

