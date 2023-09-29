import { Component, inject } from '@angular/core';
import {
  GuardTypePipe,
  Slide,
  Widget,
  isImage,
  isText,
} from '@test-widgets/shared-utils';
import { NgIf } from '@angular/common';
import {
  SlideService,
  WidgetAssemblerComponent,
} from '@test-widgets/widget-assembler';
import { WidgetsWidgetTextFormComponent } from '@test-widgets/widget-text-form';

@Component({
  standalone: true,
  imports: [
    GuardTypePipe,
    NgIf,
    WidgetAssemblerComponent,
    WidgetsWidgetTextFormComponent,
  ],
  providers: [SlideService],
  selector: 'test-widgets-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  slide: Slide = {
    style: {},
    widgets: [],
    fontsWithSizeAndLineHeight: [],
  };

  isText = isText;
  isImage = isImage;

  private slideService = inject(SlideService);

  ngOnInit() {
    this.slide = this.slideService.getSlide();
  }

  onFormChange(kind: Widget['kind'], data: Widget['data'], index: number) {
    const widget = { kind, data } as Widget;
    const ret = this.slide.widgets.slice(0);
    ret[index] = {
      ...ret[index],
      ...widget,
    };

    this.slide = { ...this.slide, widgets: ret };
  }
}
