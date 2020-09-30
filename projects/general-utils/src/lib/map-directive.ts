import { OnInit, Input, ElementRef } from '@angular/core';
import { Location } from './models';

export abstract class MapDirective implements OnInit {
  @Input() initialLocation: Location;

  @Input() abstract maxZoomIn: number;

  @Input() abstract maxZoomOut: number;

  constructor(protected elementRef: ElementRef) {}

  abstract ngOnInit(): void;
}
