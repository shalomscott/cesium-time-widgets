import { Injectable } from '@angular/core';
import { Target } from '@targets';
import { combineLatest, interval, Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { randomTarget } from './target-utils';

@Injectable()
export class TargetsService {
  createTargetStream(
    targetsStreamParams: TargetsStreamParams,
    targetUpdateParmas: TargetUpdateParmas
  ): Observable<Target[]> {
    return combineLatest(
      this.createUpdatingTargets(targetsStreamParams, targetUpdateParmas)
    );
  }

  createUpdatingTargets(
    { targetsAmount }: TargetsStreamParams,
    targetUpdateParmas: TargetUpdateParmas
  ): Observable<Target>[] {
    const targetsWithUpdates = Array.from({ length: targetsAmount }, () => {
      const targetwithUpdates = this.createUpdatingTarget(targetUpdateParmas);
      return targetwithUpdates;
    });

    return targetsWithUpdates;
  }

  createUpdatingTarget({
    updatesAmount,
    updateInterval,
    updateProbability,
  }: TargetUpdateParmas): Observable<Target> {
    let target = randomTarget();
    return interval(updateInterval).pipe(
      take(updatesAmount),
      map(() => {
        if (Math.random() > updateProbability) {
          return target;
        }

        const {
          id,
          name,
          mood,
          nationality,
          ...updatedValues
        } = randomTarget();
        const newTarget: Target = {
          ...target,
          ...updatedValues,
        };
        target = newTarget;
        return target;
      }),
      distinctUntilChanged(
        (before, after) => JSON.stringify(before) === JSON.stringify(after)
      )
    );
  }
}

export interface TargetUpdateParmas {
  updatesAmount: number;
  updateInterval: number;
  updateProbability: number;
}

export interface TargetsStreamParams {
  targetsAmount: number;
}
