import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
  Type,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';

import { WidgetDirective } from './widget.directive';
import { AdComponent, Slide, Widget } from '@test-widgets/shared-utils';
import { NgFor } from '@angular/common';
import { ErrorComponent } from './error.component';

const mapWidgetKindToComponent: Record<
  Widget['kind'],
  () => Promise<Type<any>>
> = {
  text: () =>
    import(/* webpackChunkName: "text" */ '@test-widgets/widget-text-ui').then(
      (a) => a.WidgetsWidgetTextUiComponent
    ),
  image: () =>
    import(
      /* webpackChunkName: "image" */ '@test-widgets/widget-image-ui'
    ).then((a) => a.WidgetsWidgetImageUiComponent),
};

@Component({
  standalone: true,
  selector: 'app-widget-banner',
  imports: [NgFor, WidgetDirective],
  template: `
    <div class="widgetHostWrapper" *ngFor="let widget of slide.widgets">
      <ng-template widgetHost></ng-template>
    </div>
  `,
  styles: [
    `
      app-widget-banner {
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
      }

      div.widgetHostWrapper {
        position: absolute;
        overflow: hidden;
      }

      .lmp_smaller {
        font-size: var(--lmp_smaller_font_size);
        line-height: var(--lmp_smaller_line_height);
      }

      .lmp_small {
        font-size: var(--lmp_small_font_size);
        line-height: var(--lmp_small_line_height);
      }

      .lmp_normal {
        font-size: var(--lmp_normal_font_size);
        line-height: var(--lmp_normal_line_height);
      }

      .lmp_big {
        font-size: var(--lmp_big_font_size);
        line-height: var(--lmp_big_line_height);
      }

      .lmp_bigger {
        font-size: var(--lmp_bigger_font_size);
        line-height: var(--lmp_bigger_line_height);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WidgetBannerComponent implements AfterViewInit, OnChanges {
  @Input() slide: Slide = {
    style: {},
    widgets: [],
    fontsWithSizeAndLineHeight: [],
  };

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);

  @ViewChildren(WidgetDirective) widgetHosts!: QueryList<WidgetDirective>;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['slide'].firstChange) {
      this.loadWidgets();
    }
  }

  ngAfterViewInit(): void {
    this.setFontSizeAndLineHeightToCSSVariable();
    this.loadWidgets();

    // for (let i = 0; i < this.widgets.length; i++) {
    //   const widget = this.widgets[i];
    //   this.createComp(widget, i);
    // }
  }

  setFontSizeAndLineHeightToCSSVariable() {
    for (const fontWithSize of this.slide.fontsWithSizeAndLineHeight) {
      this.elementRef.nativeElement.style.setProperty(
        `--${fontWithSize.name}_font_size`,
        fontWithSize.fontSize
      );
      this.elementRef.nativeElement.style.setProperty(
        `--${fontWithSize.name}_line_height`,
        fontWithSize.lineHeight
      );
    }
  }

  async loadWidgets() {
    const components = await Promise.allSettled(
      this.slide.widgets.map((widget) => {
        return mapWidgetKindToComponent[widget.kind]();
      })
    );

    this.widgetHosts.map((adDirective, index) => {
      const widget = this.slide.widgets[index];
      const viewContainerRef = adDirective.viewContainerRef;
      viewContainerRef.clear();
      const resultPromise = components[index];

      let component = null;
      if (resultPromise.status === 'fulfilled') {
        component = resultPromise.value;
      } else {
        component = ErrorComponent;
      }

      const data = widget.data;
      const componentRef =
        viewContainerRef.createComponent<AdComponent<typeof data>>(component);
      const { x, y, width, height } = widget.pos;
      // const { left, top, width, height } = widget.style;
      const parent = componentRef.location.nativeElement.parentNode;

      this.renderer.setStyle(parent, 'left', x + '%');
      this.renderer.setStyle(parent, 'top', y + '%');
      this.renderer.setStyle(parent, 'width', width + '%');
      this.renderer.setStyle(parent, 'height', height + '%');

      // this.renderer.setStyle(parent, 'left', left);
      // this.renderer.setStyle(parent, 'top', top);
      // this.renderer.setStyle(parent, 'width', width);
      // this.renderer.setStyle(parent, 'height', height);

      componentRef.instance.data = widget.data;
      // componentRef.instance.style = widget.style;
    });
    this.changeDetectorRef.markForCheck();
  }

  async createComp(widget: Widget, index: number) {
    const component = await mapWidgetKindToComponent[widget.kind]();
    const widgetDirective = this.widgetHosts.get(index);
    if (!widgetDirective) {
      return;
    }
    const viewContainerRef = widgetDirective.viewContainerRef;
    viewContainerRef.clear();
    const data = widget.data;
    const componentRef =
      viewContainerRef.createComponent<AdComponent<typeof data>>(component);
    const { x, y, width, height } = widget.pos;
    const parent = componentRef.location.nativeElement.parentNode;

    this.renderer.setStyle(parent, 'left', x + '%');
    this.renderer.setStyle(parent, 'top', y + '%');
    this.renderer.setStyle(parent, 'width', width + '%');
    this.renderer.setStyle(parent, 'height', height + '%');

    componentRef.instance.data = widget.data;
    this.changeDetectorRef.markForCheck();
  }
}
