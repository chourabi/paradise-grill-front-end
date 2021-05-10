import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private idTable = '116205589736097c47d7e515';
  private productsOrder=[];


  constructor() { }

  public setTableId(id){
    this.idTable = id;
  }


  public  addProductOrder(product):boolean{


    for (let i = 0; i < this.productsOrder.length; i++) {
      const element = this.productsOrder[i];

      if( element.product.id == product.product.id ){
        return false;
      }
      
    }

    this.productsOrder.push(product);
    return true;
  }

  public getProductOrders(){
    return this.productsOrder;
  }

  public initProductOrders(){
    this.productsOrder = [];
  }

  public getTableID(){
    return this.idTable;
  }

  

  public plusProductQuantity(index){
    this.productsOrder[index].quantity ++;
  }

  public minusProductQuantity(index){
    if (this.productsOrder[index].quantity > 0) {
      this.productsOrder[index].quantity --;
    }
  }


  
}
