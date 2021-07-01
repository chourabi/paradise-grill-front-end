import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
})
export class TablesPage implements OnInit {

  isLoading = false;
  tables = [];


  constructor(private router:Router, public orders:OrdersService, private api:ApiService, public alertController:AlertController, public loadingController:LoadingController) { }

  ngOnInit() {
    this.getTables();
  }



  getTables(){
    this.isLoading = true;

    this.api.getTablesList().subscribe((data:any)=>{
      this.tables = data;
      this.isLoading = false
    },(err)=>{
      this.isLoading = false;
    })
  }


  async customAlert(title,message){
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
  }

  async selectTable(id) {

    const alert = await this.alertController.create({
      header: 'Confirmer!',
      message: 'Voulez-vous vraiment commencer à prendre des commandes à partir de cette table?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmer',
          handler: async() => {
            const loading = await this.loadingController.create({
              message: "S'il vous plaît, attendez..."
            });
            await loading.present();


            this.api.openTable(id).subscribe((data:any)=>{
              console.log(data);
              loading.dismiss();

              if (data.success) {
                this.orders.setTableId(id);
                this.router.navigate(['/home/all']);
              }
              
            },(err)=>{
              loading.dismiss();
              this.customAlert("Erreur","Une erreur s'est produite. Veuillez réessayer");
            })






          }
        }
      ]
    });

    await alert.present();
  }

}
