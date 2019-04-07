import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import {HttpModule, Http} from '@angular/http';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SaleServiceProvider } from '../providers/sale-service/sale-service';
import { CartServiceProvider } from '../providers/cart-service/cart-service';
import {IonicStorageModule} from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { OrderPageModule } from '../pages/order/order.module';
import { LoginPageModule } from '../pages/login/login.module';
import { ReportPageModule } from '../pages/reports/report/report.module';
import { PrintPageModule } from '../pages/print/print.module';
import { KitchenDisplayPageModule } from '../pages/kitchen-display/kitchen-display.module';
import { SaleReportPageModule } from '../pages/reports/sale-report/sale-report.module';
import { AuthProvider } from '../providers/auth/auth';
import { KitchenProvider } from '../providers/kitchen/kitchen';
import { DemandServiceProvider } from '../providers/demand-service/demand-service';
import { ReportSerivceProvider } from '../providers/report-serivce/report-serivce';
import { PrintProvider } from '../providers/print/print';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    OrderPageModule,
    LoginPageModule,
    KitchenDisplayPageModule,
    ReportPageModule,
    PrintPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SaleServiceProvider,
    CartServiceProvider,
    AuthProvider,
    KitchenProvider,
    DemandServiceProvider,
    ReportSerivceProvider,
    LocalNotifications,
    PrintProvider,
    BluetoothSerial,
  ]
})
export class AppModule {}
