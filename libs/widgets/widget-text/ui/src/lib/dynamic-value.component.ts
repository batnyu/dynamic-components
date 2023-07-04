import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DynamicValueConfig } from '@test-widgets/widget-text-model';

@Component({
  selector: 'dynamic-value',
  standalone: true,
  imports: [],
  template: ` <span>{{ value }}</span> `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicValueComponent {
  @Input() set config(value: string) {
    if (value) {
      console.log('value', value);
      const dynamicValueConfig = JSON.parse(value) as DynamicValueConfig;
      console.log(dynamicValueConfig);
      this.value = `Data from backend with type ${dynamicValueConfig.type} and id ${dynamicValueConfig.id}`;
    }
  }

  value = 'machin';

  constructor() {}
}
