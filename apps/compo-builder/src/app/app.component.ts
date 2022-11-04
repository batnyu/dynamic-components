import { Component, inject } from '@angular/core';
import { isText, isImage, Widget } from '@test-widgets/shared-utils';
import { WidgetService } from '@test-widgets/widget-assembler';

@Component({
  selector: 'test-widgets-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  widgets: Widget[] = [];

  isText = isText;
  isImage = isImage;

  private adService = inject(WidgetService);

  ngOnInit() {
    this.widgets = this.adService.getWidgets();
  }

  onFormChange(kind: Widget['kind'], data: Widget['data'], index: number) {
    const widget = { kind, data } as Widget;
    const ret = this.widgets.slice(0);
    ret[index] = {
      ...ret[index],
      ...widget,
    };
    this.widgets = ret;
  }
}
