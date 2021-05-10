import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  product:any = {};

  options = [];
  quantity = 1;

  apiEndPoint;
  isLoading = false;
  additionalIformation="";

  constructor(public router:Router, public toastController:ToastController, public orders:OrdersService, public nav:NavController,private api:ApiService,private route:ActivatedRoute,public alertCtrl:AlertController) { }

  ngOnInit() {
    this.apiEndPoint = environment.api;
    this.getProductDetails();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Ajouté avec succès',
      message: 'Votre commande est ajoutée avec succès à votre liste de précommande',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'cart',
          text: "J'ai fini",
          handler: () => {
            this.router.navigate(['/orders'])
          }
        }, {
          text: 'Continuer',
          role: 'cancel',
          handler: () => {
            this.back()
          }
        }
      ]
    });
    await toast.present();
  }

  
  async presentErrorToast() {
    const toast = await this.toastController.create({
      header: 'Oups',
      message: 'Ce produit est déjà dans votre liste de commandes',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'cart',
          text: "J'ai fini",
          handler: () => {
            this.router.navigate(['/orders'])
          }
        }, {
          text: 'Continuer',
          role: 'cancel',
          handler: () => {
            this.back()
          }
        }
      ]
    });
    await toast.present();
  }


  qUpdate(action:boolean){
    switch (action) {
      case true:
        this.quantity++;
        break;
      case false:
        if (this.quantity != 1) {
          this.quantity--;
        }
        break;
        
    
      default:
        break;
    }
  }


  getProductDetails(){
    this.isLoading = true;
    let id = this.route.snapshot.params.id;
    this.api.getProductDetails(id).subscribe((data:any)=>{
      console.log(data);
      
      this.product = data.details;
      this.options = data.options;
      this.isLoading = ! this.isLoading;
    },(err)=>{
      this.isLoading = ! this.isLoading;
    })

  }

  back(){
    this.nav.back();
  }


  addItem(itemIndex,optionIndex){
    console.log(itemIndex,optionIndex);
    this.options[optionIndex].items[itemIndex].selected = this.options[optionIndex].items[itemIndex].selected == null ? true : ! this.options[optionIndex].items[itemIndex].selected;
    
  }


  orderPrice(){
   
    
    const productPrice = this.product == null ? 0 : this.product.price;
    let totalToPay = productPrice * this.quantity;

    // check for suppliments
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];

      const maximumFreeItems = option.option.nombre_maximum_option;
      const priceForAdditional = option.option.prix_option_supp;
      let nbrOfSelectedItems = 0;


      // have a look on the selected items selected option
      for (let j = 0; j < option.items.length; j++) {
        const item = option.items[j];
        if (item.selected == true) {
          nbrOfSelectedItems++;
        }
        
      }

      // make the calculus if the slected items > maximum allowed items
      if( nbrOfSelectedItems > maximumFreeItems ){
        let totalAdditional = (nbrOfSelectedItems - maximumFreeItems) * priceForAdditional;
        totalToPay += totalAdditional;
      }
      
      
    }

    return totalToPay;

  }

  placePreOrder(){
    let items = [];

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];

      const maximumFreeItems = option.option.nombre_maximum_option;
      const priceForAdditional = option.option.prix_option_supp;
      let nbrOfSelectedItems = 0;
     


      // have a look on the selected items selected option
      for (let j = 0; j < option.items.length; j++) {
        const item = option.items[j];
        if (item.selected == true) {
          items.push(item);
        }
        
      }
    }

    
    let orderItem = {
      product:this.product,
      items: items,
      quantity:this.quantity,
      additionalIformation:this.additionalIformation,
      unitPrice:(this.orderPrice() / this.quantity)
    }

    console.log(orderItem);

    if (this.orders.addProductOrder(orderItem)) {
      this.presentToastWithOptions();
    }else{
      this.presentErrorToast();
    }

    

    
  }


  async confirmPreOrder()  {
    
    const alert = await this.alertCtrl.create({ 
      header: 'Veuillez confirmer', 
      message: 'Êtes-vous sûr de vouloir précommander ce produit?', 
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Pré-commander',
          handler: () => {
            this.placePreOrder()
          }
        }
      ] 
      }); 
      await alert.present(); 
      //const result = await alert.onDidDismiss();  
  }

}
