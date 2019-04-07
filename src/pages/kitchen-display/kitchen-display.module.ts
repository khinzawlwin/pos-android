import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KitchenDisplayPage } from './kitchen-display';

@NgModule({
  declarations: [
    KitchenDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(KitchenDisplayPage),
  ],
})
export class KitchenDisplayPageModule {}
