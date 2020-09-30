import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CesiumComponent } from './cesium/cesium.component';

const routes: Routes = [
  {
    path: 'cesium',
    component: CesiumComponent,
    data: { menu: true },
    loadChildren: () => import('@cesium-map').then((m) => m.CesiumMapModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
