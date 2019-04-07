import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderModalPage } from './order-modal';

@NgModule({
  declarations: [
    OrderModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderModalPage),
  ],
})
export class OrderModalPageModule {}
