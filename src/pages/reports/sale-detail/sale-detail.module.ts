import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaleDetailPage } from './sale-detail';

@NgModule({
  declarations: [
    SaleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SaleDetailPage),
  ],
})
export class SaleDetailPageModule {}
