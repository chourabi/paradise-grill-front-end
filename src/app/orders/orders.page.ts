import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  ordersList = [];
  apiEndPoint;
  waitingTime="";
  tableStatus=0;
  onGoAmmountToPay = 0;

  isLoading = true;
  errorLoading = false;


  constructor(public api:ApiService, public loadingController:LoadingController, public alertController:AlertController, public router:Router, public toastController:ToastController, public nav:NavController,public orders:OrdersService) { }

  ngOnInit() {
  this.ordersList = this.orders.getProductOrders();
  this.apiEndPoint = environment.api;
  this.isLoading = true;

  this.api.getTableStatus().subscribe((data:any)=>{
    this.onGoAmmountToPay = 0;

    console.log(data);
    const products = data.products;

    products.map((p)=>{
      this.onGoAmmountToPay+= ( p.quantity * p.unitPrice );
    })

    this.isLoading = false;
    this.tableStatus = data.status;


  },(error)=>{
    this.isLoading = false;
    this.errorLoading = false;
  })

  }

  back(){
    this.nav.back();
  }




  
  transformTime(value){
    if (value != null) {
      var str='';

      if (value < 60) {
        str = value+' min';
      }else if (value >= 60) {
        str = ''+( (value/60).toFixed() )+' h'+' '+( value%60)+' min'
      }

      return str;
    }

    return '--'
  
}

calculateTotalMinutes(){
  let totalMinuts = 0;
  for (let i = 0; i < this.ordersList.length; i++) {
    const item = this.ordersList[i];
    totalMinuts+=item.product.prep_time;
    
  }
  return totalMinuts;
}

  calculateToatal(){
    let total = 0;
    let totalMinuts = 0;



    for (let i = 0; i < this.ordersList.length; i++) {
      const item = this.ordersList[i];

      total+= (item.unitPrice * item.quantity)
      totalMinuts+=item.product.prep_time;
      
    }

    return total;
  }


  plusOrderQuantity(index){
    this.ordersList[index].quantity++;
  }
  minusOrderQuantity(index){
    this.ordersList[index].quantity--;
    if (this.ordersList[index].quantity == 0) {
      this.ordersList.splice(index,1);
    }
  }


  async confirmOrder() {
    const alert = await this.alertController.create({
      header: "Confirmer l'ordre",
      message: 'êtes-vous sûr que vous avez terminé?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmer',
          handler: () => {
            this.sendOrderToCoock();
          }
        }
      ]
    });

    await alert.present();
  }

  async doneToast(title , message) {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      position: 'bottom',
      duration: 6000
     
    });
    await toast.present();
  }

  async sendOrderToCoock(){
    // loading cnrl
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    // api call
    this.api.sendTableOrder().subscribe((data:any)=>{
      console.log(data);
      
      

      

      if (data.ordre_id) {
        loading.dismiss();
        this.orders.initProductOrders();
        this.ordersList = [];
        this.doneToast('Commande à la cuisine','vous pouvez toujours ajouter quoi que ce soit à tout moment.');
        
        this.router.navigate(['/home/all']);

      }else{
        loading.dismiss();
        this.doneToast('Oups','Oops something went wrong, please try again.');
      }

    },(err)=>{
      this.doneToast('Oups','Oops something went wrong, please try again.');
      loading.dismiss()
    })

    
  }

}
