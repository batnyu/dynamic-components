import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  DynamicValueConfig,
  PoiDynamicValueConfig,
} from '@test-widgets/widget-text-model';
import {
  catchError,
  delay,
  interval,
  map,
  Observable,
  of,
  scan,
  tap,
  throwError,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DynamicDataFetcherService } from './dynamic-data-fetcher.service';
import { format } from 'date-fns';

@Component({
  selector: 'dynamic-value-angular',
  standalone: true,
  imports: [AsyncPipe],
  template: ` <span>{{ value | async }}</span> `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicValueComponent implements OnInit {
  @Input() set config(value: string) {
    if (value) {
      const dynamicValueConfig = JSON.parse(value) as DynamicValueConfig;
      this.value = this.getValueBasedOnType(dynamicValueConfig).pipe(
        tap({
          next: () => {
            return this.dynamicDataFetcher.dynamicValueInfoSubject.next({
              dynamicValueId: this.dynamicValueId,
              state: 'ok',
            });
          },
          error: () => {
            return this.dynamicDataFetcher.dynamicValueInfoSubject.next({
              dynamicValueId: this.dynamicValueId,
              state: 'error',
              message: `Error fetching dynamic value for type ${dynamicValueConfig.kind}`,
            });
          },
        }),
        catchError(() => of('Error'))
      );
    }
  }

  @Input() dynamicValueId = '';

  value!: Observable<string>;

  private dynamicDataFetcher = inject(DynamicDataFetcherService);

  ngOnInit(): void {
    // console.log('Init dynamic value');
  }

  getValueBasedOnType(dynamicValueConfig: DynamicValueConfig) {
    switch (dynamicValueConfig.kind) {
      case 'unset': {
        return of('unset');
      }
      case 'countdown': {
        return of(
          this.getDaysCount(dynamicValueConfig.mode, dynamicValueConfig.date)
        );
      }
      case 'poi': {
        return this.getPoiValue(dynamicValueConfig);
      }
      case 'skier': {
        return throwError(() => {
          return 'Error';
        });
        return interval(250).pipe(
          scan((acc, curr) => {
            return Math.max(0, acc + (Math.random() > 0.5 ? -1 : 1));
          }, 0),
          map((a) => {
            // return randomIntFromInterval(50, 70) + '';
            return a + '';
          })
        );
      }

      default: {
        const _exhaustiveCheck: never = dynamicValueConfig;
        return _exhaustiveCheck;
      }
    }
  }

  getDifferenceBetweenTwoDates(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const difference = d1.getTime() - d2.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  countIncreasing(startDate: string, today: string): number {
    const days = this.getDifferenceBetweenTwoDates(today, startDate);
    return days < 0 ? 0 : days;
  }

  countDecreasing(endDate: string, today: string): number {
    const days = this.getDifferenceBetweenTwoDates(endDate, today);
    return days < 0 ? 0 : days;
  }

  getDaysCount(mode: 'INCREASING' | 'DECREASING', date: string) {
    const todayString = format(new Date(), 'yyyy-MM-dd');
    const utcDate = format(new Date(date.toString()), 'yyyy-MM-dd');
    return mode === 'INCREASING'
      ? this.countIncreasing(utcDate, todayString) + ''
      : this.countDecreasing(utcDate, todayString) + '';
  }

  getPoiValue(poiDynamicValueConfig: PoiDynamicValueConfig) {
    switch (poiDynamicValueConfig.field) {
      case 'associateMessage': {
        const poi = pois.find((poi) => poi.id === poiDynamicValueConfig.id);
        if (!poi) {
          return throwError(() => {
            return 'Error';
          });
        }
        const associateMessage = poi.associateMessages.find(
          (associateMessage) =>
            associateMessage.language === poiDynamicValueConfig.lang
        );

        if (!associateMessage) {
          return throwError(() => {
            return 'Error';
          });
        }
        return of(associateMessage.data).pipe(delay(500));
      }
      case 'time': {
        const poi = pois.find((poi) => poi.id === poiDynamicValueConfig.id);
        if (!poi) {
          return throwError(() => {
            return 'Error';
          });
        }
        const timeGroup =
          poi.poiTimeRanges[0].timeGroups[poiDynamicValueConfig.timeGroupIndex];
        if (!timeGroup) {
          return throwError(() => {
            return 'Error';
          });
        }

        const time =
          poiDynamicValueConfig.moment === 'begin'
            ? timeGroup.beginTime
            : timeGroup.endTime;
        //   return throwError(() => {
        //     return 'Error';
        //   });

        return of(time).pipe(delay(500));
      }

      default: {
        const _exhaustiveCheck: never = poiDynamicValueConfig;
        return _exhaustiveCheck;
      }
    }
  }
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const pois = [
  {
    id: 42,
    associateMessages: [
      {
        language: 'fr_FR',
        data: 'Tous à la piscine',
      },
      {
        language: 'en_US',
        data: 'Everybody in the pool!',
      },
    ],
    poiTimeRanges: [
      {
        id: 2372,
        autoClosing: true,
        autoOpening: true,
        closed: false,
        day: 1,
        daysDifferent: false,
        period: {
          id: 39,
          alternateName: null,
          beginDate: '2021-06-10',
          customerTreeId: 5,
          endDate: '2035-02-05',
          name: 'Automne',
        },
        used: true,
        timeGroups: [
          {
            id: 91,
            beginTime: '07:10',
            endTime: '10:35',
            timeGroupsIndex: 1,
          },
          {
            id: 3019,
            beginTime: '11:00',
            endTime: '13:00',
            timeGroupsIndex: 2,
          },
          {
            id: 3020,
            beginTime: '13:15',
            endTime: '20:00',
            timeGroupsIndex: 3,
          },
        ],
      },
    ],
  },
];
