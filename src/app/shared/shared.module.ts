import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CesiumMapDirective } from '@cesium-map';
import { Enum2StringPipe } from './enum-2-string.pipe';
import { Latlng2StringPipe } from './latlng-2-string.pipe';

@NgModule({
  declarations: [Enum2StringPipe, Latlng2StringPipe, CesiumMapDirective],
  imports: [CommonModule],
  exports: [Enum2StringPipe, Latlng2StringPipe, CesiumMapDirective],
})
export class SharedModule {}
