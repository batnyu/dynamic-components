import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  QueryList,
  Renderer2,
  Type,
  ViewChildren,
} from '@angular/core';

import { AdDirective } from './ad.directive';
import { AdItem, Widget } from './ad-item';
import { AdComponent } from './ad.component';
import { NgFor } from '@angular/common';

const mapWidgetKindToComponent: Record<
  Widget['kind'],
  () => Promise<Type<any>>
> = {
  'hero-job-ad': () =>
    import('./hero-job-ad.component').then((a) => a.HeroJobAdComponent),
  'hero-profile': () =>
    import('./hero-profile.component').then((a) => a.HeroProfileComponent),
  text: () =>
    import(
      './../../../widgets/widget-text/ui/src/lib/widgets-widget-text-ui.component'
    ).then((a) => a.WidgetsWidgetTextUiComponent),
};

@Component({
  standalone: true,
  selector: 'app-ad-banner',
  imports: [NgFor, AdDirective],
  template: `
    <div *ngFor="let widget of widgets">
      <ng-template adHost></ng-template>
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
export class AdBannerComponent implements AfterViewInit {
  @Input() widgets: AdItem[] = [];

  private changeDetectorRef = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);

  @ViewChildren(AdDirective) adHosts!: QueryList<AdDirective>;

  ngAfterViewInit(): void {
    this.loadWidgets();
  }

  async loadWidgets() {
    const components = await Promise.all(
      this.widgets.map((widget) => {
        return mapWidgetKindToComponent[widget.kind]();
      })
    );

    this.adHosts.map((adDirective, index) => {
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
