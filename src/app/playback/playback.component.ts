import { Component, OnInit } from '@angular/core';
import { CesiumMapService } from '@cesium-map';

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

  constructor(private cesiumMapService: CesiumMapService) {}

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
}
