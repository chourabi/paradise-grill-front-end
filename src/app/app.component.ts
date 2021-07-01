import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  filters = [];

  constructor(private api:ApiService,private menu:MenuController) {}


  ngOnInit(): void {
    this.getParentsFilters();
  }

  getParentsFilters(){
    this.api.getCategoriesList().subscribe((filters:any)=>{

      console.log(filters);
      
      
      this.filters = [];

      filters.forEach(filter => {
        this.filters.push({
          "id":filter.id,
          "categorie":filter.categorie,
          "icon_class_name":filter.icon_class_name,
          "clicked":false
        })
      });
      
      
    },(error)=>{

    });
  }

  toggleMenu(){
    this.menu.toggle('sidemenu');
  }


}
