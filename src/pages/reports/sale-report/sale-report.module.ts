import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaleReportPage } from './sale-report';

@NgModule({
  declarations: [
    SaleReportPage,
  ],
  imports: [
    IonicPageModule.forChild(SaleReportPage),
  ],
})
export class SaleReportPageModule {}
