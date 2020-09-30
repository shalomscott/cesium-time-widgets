import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CesiumMapService, CesiumTargetsDrawerService } from '@cesium-map';
import { CesiumComponent } from './cesium/cesium.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';

@NgModule({
  declarations: [AppComponent, CesiumComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  providers: [CesiumMapService, CesiumTargetsDrawerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
