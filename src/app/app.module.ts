import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CesiumMapService } from '@cesium-map';
import { CesiumComponent } from './cesium/cesium.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlaybackComponent } from './playback/playback.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AppComponent, CesiumComponent, PlaybackComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [CesiumMapService],
  bootstrap: [AppComponent],
})
export class AppModule {}
