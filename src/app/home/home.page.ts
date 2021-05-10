import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {



  subfilters = [];
  promotedProducts = [];
  apiEndPoint;
  selectedLabel="Tous"
  products = [];
  all = true;
  isLoading = false;
  ordersList = [];
  constructor(private orders:OrdersService, private api:ApiService,private menu:MenuController,private route:ActivatedRoute) {}


  openSideMenu() {
    this.menu.enable(true, 'sidemenu');
    this.menu.open('sidemenu');
  }



  getPromotedProducts(){
    this.api.getPromotedProducts().subscribe((data:any)=>{
      
      this.promotedProducts = data;
      
    },(error)=>{

    });
  }




  subFilterClick(i){
    this.subfilters.forEach(f => {
      f.clicked = false;
    });
    this.subfilters[i].clicked = !  this.subfilters[i].clicked;
    this.selectedLabel= this.subfilters[i].filter_label

    this.getProductsBySubCategories(this.subfilters[i].id);
  }


getSubs(id){

    this.isLoading = ! this.isLoading;
    this.api.getSubCategoriesList(id).subscribe((data:any)=>{
      this.isLoading = ! this.isLoading;
      this.subfilters = [];

      data.forEach(filter => {
        this.subfilters.push({
          "id":filter.filter_id,
          "filter_label":filter.filter_label,
          "clicked":false,
          "product_type":filter.product_type
        })
      });
      
      this.subFilterClick(0);
      
      
    },(error)=>{
      this.isLoading = ! this.isLoading;
    });
  }


  getRouteSelectedID(){
    let id = this.route.snapshot.params.category;
    
    if (id == 'all') {
      this.all = true
      // show welcome message or something !
    }else{
      this.all = false;
      this.getSubs(id);
    }
  }

  ngOnInit(): void {
    this.apiEndPoint = environment.api;
    this.getRouteSelectedID();
    this.ordersList = this.orders.getProductOrders();
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



  getProductsBySubCategories(id){
    this.isLoading = ! this.isLoading;
    this.api.getProductsBySubCategories(id).subscribe((data:any)=>{
      this.products = data;
      this.isLoading = ! this.isLoading;
    },(error)=>{
      this.isLoading = ! this.isLoading;
    })
  }


  getProductsByMainCategories(id){
    this.api.getProductsByParentCategories(id).subscribe((data:any)=>{
      this.products = data;
    },(error)=>{

    })
  }

  getAllProducts(){
    this.api.getProducts().subscribe((data:any)=>{
      this.products = data;
    },(error)=>{

    })
  }

  

}
