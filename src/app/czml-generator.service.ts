import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CzmlGeneratorService {
  private readonly SIMULATION_DURATION = 3 * 60 * 60 * 1000; // 3h
  private readonly startDate = new Date();
  private startLong = 31.497562;
  private startLat = 33.494846;

  constructor() {}

  generateCzmlDocPacket() {
    const startISO = this.startDate.toISOString();
    const endISO = new Date(
      this.startDate.getTime() + this.SIMULATION_DURATION
    ).toISOString();
    return {
      id: 'document',
      name: 'Target Scene',
      version: '1.0',
      clock: {
        interval: `${startISO}/${endISO}`,
        currentTime: startISO,
        range: 'CLAMPED',
      },
    };
  }

  generateCzmlEntityPacket(entityId: string, image: string): any {
    return {
      id: entityId,
      billboard: {
        image,
        scale: 0.2,
      },
    };
  }

  generatePositionPackets(packetId: string) {
    return this.generatePositionIntervals().map((interval) => ({
      id: packetId,
      position: interval,
    }));
  }

  generatePositionIntervals() {
    const startMs = this.startDate.getTime();
    let time = 0;
    let long = this.startLong;
    let lat = this.startLat;
    const result = [];
    while (time < this.SIMULATION_DURATION) {
      const { duration: d, longDiff, latDiff } = this.randomDurationSegment();
      const start = new Date(startMs + time);
      const end = new Date(startMs + time + d);
      result.push({
        interval: `${start.toISOString()}/${end.toISOString()}`,
        cartographicDegrees: [long, lat, 0],
      });
      time += d;
      long += longDiff;
      lat += latDiff;
    }
    return result;
  }

  private randomDurationSegment() {
    const duration = (5 * Math.random() + 5) * 60 * 1000;
    const longDegrees = 0.2 * (Math.random() - 0.5) + 0.2;
    const latDegrees = 0.4 * (Math.random() - 0.5);
    return {
      duration,
      longDiff: longDegrees,
      latDiff: latDegrees,
    };
  }
}
