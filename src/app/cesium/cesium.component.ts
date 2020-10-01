import { Component, OnDestroy, OnInit } from '@angular/core';
import { CzmlDataSource } from 'cesium';
import { CesiumMapService } from '@cesium-map';
import { Location } from '@general-utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CzmlGeneratorService } from '../czml-generator.service';

@UntilDestroy()
@Component({
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
})
export class CesiumComponent implements OnInit, OnDestroy {
  readonly SIMULATION_DURATION = 3 * 60 * 60 * 1000; // 3h
  readonly INITIAL_LOCATION: Location = {
    west: 25.0,
    south: 25.0,
    east: 40.0,
    north: 40.0,
  };

  readonly MAX_ZOOM_IN = 20000;
  readonly MAX_ZOOM_OUT = 6000000;

  constructor(
    private cesiumMapService: CesiumMapService,
    private czmlGeneratorService: CzmlGeneratorService
  ) {}

  ngOnInit() {
    this.cesiumMapService.mapReady.subscribe(() => {
      const czml = this.generateCzmlScene();
      console.log('Generated CZML:\n', czml);
      this.cesiumMapService.czmlDataSource.load(czml);
    });
  }

  ngOnDestroy(): void {}

  private generateCzmlScene(): any {
    const doc = this.czmlGeneratorService.generateCzmlDocPacket();
    const targetA = this.czmlGeneratorService.generateCzmlEntityPacket(
      'a',
      '/assets/arrow_blue.png'
    );
    const targetB = this.czmlGeneratorService.generateCzmlEntityPacket(
      'b',
      '/assets/arrow_green.png'
    );
    targetA.position = this.czmlGeneratorService.generatePositionIntervals();

    return [
      doc,
      targetA,
      targetB,
      ...this.czmlGeneratorService.generatePositionPackets('b'),
    ];
  }
}
