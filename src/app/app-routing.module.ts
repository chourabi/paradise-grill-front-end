import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppGuard } from './app.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home/all',
    pathMatch: 'full',
  },

  {
    path: 'home/:category',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[AppGuard]
  },
  
  
  {
    path: 'product-details/:id',
    loadChildren: () => import('./product-details/product-details.module').then( m => m.ProductDetailsPageModule),
    canActivate:[AppGuard]
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule),
    canActivate:[AppGuard]
  },
  {
    path: 'table-scan',
    loadChildren: () => import('./table-scan/table-scan.module').then( m => m.TableScanPageModule)
  },


  {
    path: 'tables',
    loadChildren: () => import('./tables/tables.module').then( m => m.TablesPageModule)
  },

  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
