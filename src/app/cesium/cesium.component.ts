import { Component, OnDestroy, OnInit } from '@angular/core';
import { CzmlDataSource } from 'cesium';
import { CesiumMapService } from '@cesium-map';
import { Location } from '@general-utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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

  constructor(private cesiumMapService: CesiumMapService) {}

  ngOnInit() {
    console.log(this.generateCzmlScene());
    setTimeout(
      () =>
        this.cesiumMapService.viewer.dataSources.add(
          CzmlDataSource.load(this.generateCzmlScene())
        ),
      2000
    );
  }

  ngOnDestroy(): void {}

  private generateCzmlScene(): any {
    const now = new Date();
    const startISO = now.toISOString();
    const endISO = new Date(
      now.getTime() + this.SIMULATION_DURATION
    ).toISOString();
    const startLong = 31.497562;
    const startLat = 33.494846;

    return [
      {
        id: 'document',
        name: 'Target Scene',
        version: '1.0',
        clock: {
          interval: `${startISO}/${endISO}`,
          currentTime: startISO,
          range: 'CLAMPED',
        },
      },
      {
        id: 'targeta',
        name: 'Target A',
        description: 'Moving target: A',
        position: {
          epoch: startISO,
          cartographicDegrees: this.generateCoordsForDuration(
            startLong,
            startLat,
            this.SIMULATION_DURATION
          ),
        },
        billboard: {
          image: '/assets/arrow_filled.png',
          scale: 0.2,
        },
      },
      {
        id: 'targetb',
        name: 'Target B',
        description: 'Moving target: B',
        position: {
          epoch: startISO,
          cartographicDegrees: this.generateCoordsForDuration(
            startLong,
            startLat,
            this.SIMULATION_DURATION
          ),
        },
        billboard: {
          image: '/assets/arrow.png',
          scale: 0.2,
        },
      },
    ];
  }

  private generateCoordsForDuration(
    startLong: number,
    startLat: number,
    durationSeconds: number
  ) {
    let time = 0;
    let long = startLong;
    let lat = startLat;
    const result = [time, long, lat, 0];
    while (time < durationSeconds) {
      const { duration, longDiff, latDiff } = this.randomDurationSegment();
      time += duration;
      long += longDiff;
      lat += latDiff;
      result.push(time, long, lat, 0);
    }
    return result;
  }

  private randomDurationSegment() {
    const durationSeconds = (5 * Math.random() + 5) * 60;
    const longDegrees = 0.2 * (Math.random() - 0.5) + 0.2;
    const latDegrees = 0.4 * (Math.random() - 0.5);
    return {
      duration: durationSeconds,
      longDiff: longDegrees,
      latDiff: latDegrees,
    };
  }
}
