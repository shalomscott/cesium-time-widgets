import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { interval } from 'rxjs';
import { CesiumMapService } from '@cesium-map';
import { CzmlGeneratorService } from '../czml-generator.service';

@Component({
  selector: 'app-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss'],
})
export class PlaybackComponent implements OnInit {
  private readonly SPEED_UP_MULTIPLIER = 1000;
  private readonly SKIP_INTERVAL = 15 * 60;

  private playCommand: () => void;
  private pauseCommand: () => void;

  isPlaying = false;
  isSpedUp = false;

  constructor(
    private cesiumMapService: CesiumMapService,
    private czmlGeneratorService: CzmlGeneratorService
  ) {}

  ngOnInit(): void {
    this.playCommand = this.cesiumMapService.animationViewModel
      .playForwardViewModel.command as any;
    this.pauseCommand = this.cesiumMapService.animationViewModel.pauseViewModel
      .command as any;
  }

  togglePlay() {
    if (!this.isPlaying) {
      this.playCommand();
    } else {
      this.pauseCommand();
    }
    this.isPlaying = !this.isPlaying;
  }

  forward() {
    this.cesiumMapService.clockViewModel.currentTime.secondsOfDay += this.SKIP_INTERVAL;
  }

  backward() {
    this.cesiumMapService.clockViewModel.currentTime.secondsOfDay -= this.SKIP_INTERVAL;
  }

  toggleSpedUp() {
    if (!this.isSpedUp) {
      this.cesiumMapService.clockViewModel.multiplier = this.SPEED_UP_MULTIPLIER;
    } else {
      this.cesiumMapService.clockViewModel.multiplier = 10;
    }
    this.isSpedUp = !this.isSpedUp;
  }

  add() {
    const targetId = uuid.v4();
    const target = this.czmlGeneratorService.generateCzmlEntityPacket(
      targetId,
      '/assets/arrow.png'
    );
    const positionPackets = this.czmlGeneratorService.generatePositionPackets(
      targetId
    );
    this.cesiumMapService.czmlDataSource.process(target);
    const subscription = interval(100).subscribe((i) => {
      if (i >= positionPackets.length) {
        subscription.unsubscribe();
      } else {
        this.cesiumMapService.czmlDataSource.process(positionPackets[i]);
        console.log(`Loaded packet ${i} for ${targetId}`);
      }
    });
  }
}
