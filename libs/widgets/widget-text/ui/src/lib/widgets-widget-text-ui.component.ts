import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AdComponent } from '@test-widgets/shared-utils';
import { WidgetText } from '@test-widgets/widget-text-model';

@Component({
  selector: 'test-widgets-widgets-widget-text-ui',
  standalone: true,
  imports: [],
  template: `
    <div
      [style.backgroundColor]="data.backgroundColor"
      [class.center]="data.displayCenter"
    >
      <span>{{ data.value }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      div {
        width: 100%;
        height: 100%;
      }

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetsWidgetTextUiComponent
  implements AdComponent<WidgetText>, OnInit
{
  @Input() data: WidgetText = {
    value: 'Salut',
    displayCenter: true,
    backgroundColor: 'white',
  };

  constructor() {}

  ngOnInit(): void {}
}
