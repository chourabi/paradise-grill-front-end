import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-table-scan',
  templateUrl: './table-scan.page.html',
  styleUrls: ['./table-scan.page.scss'],
})
export class TableScanPage implements OnInit {


  constructor(private router:Router, private tableService:OrdersService, private barcodeScanner: BarcodeScanner,private alertController:AlertController,private api:ApiService, private loadingController:LoadingController) { }

  ngOnInit() {
  }

  async oups(){
    const alert = await this.alertController.create({
      header: 'Oups',
      subHeader: 'Erreur',
      message: 'Something went wrong while trying to scan QR code, please try again.',
      buttons: ['OK']
    });

    await alert.present();
  }


  scanTable(){
    this.barcodeScanner.scan().then(async barcodeData => {
      console.log('Barcode data', barcodeData);

      if (barcodeData.text != '') {
        const tableCodeToCheck = barcodeData.text;

        // loading
        const loading = await this.loadingController.create({
          message: 'Vérification...',
        });
        await loading.present();

        this.api.openTable(tableCodeToCheck).subscribe((data:any)=>{
          loading.dismiss();

          if (data.success == true) {
            this.tableService.setTableId(tableCodeToCheck);
            this.router.navigate(['/home/all'])
          }
        },(err)=>{
          loading.dismiss();
          
          this.oups();
        })



      }else{
        this.oups();
      }


     }).catch( async err => {
      const alert = await this.alertController.create({
        header: 'Oups',
        subHeader: 'Erreur',
        message: 'Something went wrong while trying to scan QR code, please try again.',
        buttons: ['OK']
      });
  
      await alert.present();
     });
  }

}
