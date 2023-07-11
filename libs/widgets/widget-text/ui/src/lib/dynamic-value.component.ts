import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DynamicValueConfig } from '@test-widgets/widget-text-model';
import { delay, interval, map, Observable, of, scan } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
      this.value = this.getValueBasedOnType(dynamicValueConfig);
    }
  }

  value!: Observable<string>;

  constructor() {}

  ngOnInit(): void {
    // console.log('Init dynamic value');
  }

  getValueBasedOnType(dynamicValueConfig: DynamicValueConfig) {
    switch (dynamicValueConfig.kind) {
      case 'unset':
        return of('unset');
      case 'poi':
        return of(
          `Data from backend with type ${dynamicValueConfig.kind} and id ${dynamicValueConfig.id}`
        ).pipe(delay(500));
      case 'skier':
        return interval(250).pipe(
          scan((acc, curr) => {
            return Math.max(0, acc + (Math.random() > 0.5 ? -1 : 1));
          }, 0),
          map((a) => {
            // return randomIntFromInterval(50, 70) + '';
            return a + '';
          })
        );

      default: {
        const _exhaustiveCheck: never = dynamicValueConfig;
        return _exhaustiveCheck;
      }
    }
  }
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
