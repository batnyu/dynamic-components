import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { AdDirective } from './ad.directive';
import { AdItem } from './ad-item';
import { AdComponent } from './ad.component';
import { NgFor } from '@angular/common';

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
        return widget.getComponent();
      })
    );
    // Maybe we can't store function in json, need to do a switch here to dynamic import components

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
