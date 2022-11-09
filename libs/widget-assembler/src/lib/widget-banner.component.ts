import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
  Type,
  ViewChildren,
} from '@angular/core';

import { WidgetDirective } from './widget.directive';
import { Widget, AdComponent } from '@test-widgets/shared-utils';
import { NgFor } from '@angular/common';

const mapWidgetKindToComponent: Record<
  Widget['kind'],
  () => Promise<Type<any>>
> = {
  text: () =>
    import('@test-widgets/widget-text-ui').then(
      (a) => a.WidgetsWidgetTextUiComponent
    ),
  image: () =>
    import('@test-widgets/widget-image-ui').then(
      (a) => a.WidgetsWidgetImageUiComponent
    ),
};

@Component({
  standalone: true,
  selector: 'app-widget-banner',
  imports: [NgFor, WidgetDirective],
  template: `
    <div *ngFor="let widget of widgets">
      <ng-template widgetHost></ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: block;
        position: relative;
      }

      div {
        position: absolute;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetBannerComponent implements AfterViewInit, OnChanges {
  @Input() widgets: Widget[] = [];

  private changeDetectorRef = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);

  @ViewChildren(WidgetDirective) widgetHosts!: QueryList<WidgetDirective>;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['widgets'].firstChange) {
      this.loadWidgets();
    }
  }

  ngAfterViewInit(): void {
    this.loadWidgets();
  }

  async loadWidgets() {
    const components = await Promise.all(
      this.widgets.map((widget) => {
        return mapWidgetKindToComponent[widget.kind]();
      })
    );

    this.widgetHosts.map((adDirective, index) => {
      const widget = this.widgets[index];
      const viewContainerRef = adDirective.viewContainerRef;
      viewContainerRef.clear();
      const component = components[index];
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
    });
    this.changeDetectorRef.detectChanges();
  }
}
