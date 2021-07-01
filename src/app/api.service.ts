import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrdersService } from './orders.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient,private orders:OrdersService) { }

  getCategoriesList(){
    return this.http.get(environment.api+'/api/mobile/categories');
  }
  getSubCategoriesList(id){
    return this.http.get(environment.api+'/api/mobile/categories/'+id);
  }

  getPromotedProducts(){
    return this.http.get(environment.api+'/api/mobile/produits/promoted');
  }

  getProductsBySubCategories(id){
    return this.http.get(environment.api+'/api/mobile/produits/category/'+id);
  }

  getProductsByParentCategories(id){
    return this.http.get(environment.api+'/api/mobile/produits/parentcategory/'+id);
  }

  getProducts(){
    return this.http.get(environment.api+'/api/mobile/produits');
  }

  getProductDetails(id){
    return this.http.get(environment.api+'/api/mobile/produit/'+id);
  }

  sendTableOrder(){
    const data = {
      tableId:this.orders.getTableID(),
      orders:this.orders.getProductOrders()
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post(environment.api+'/api/mobile/sendOrder',data,httpOptions);
  }


  getTableStatus(){
    
    const  tableId= this.orders.getTableID();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.get(environment.api+'/api/mobile/table_status/'+tableId,httpOptions);
  }

  openTable(tableId){

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.get(environment.api+'/api/mobile/table_open/'+tableId,httpOptions);
  }

  checkTableExistance(id){
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.get(environment.api+'/api/mobile/table_check/'+id,httpOptions);
  }

  getTablesList(){
    
    const  tableId= this.orders.getTableID();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.get(environment.api+'/api/mobile/tables_list',httpOptions);
  }
  


  
}
