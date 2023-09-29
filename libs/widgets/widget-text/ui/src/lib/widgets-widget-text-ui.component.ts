import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdComponent } from '@test-widgets/shared-utils';
import { DynamicValueInfo, WidgetText } from '@test-widgets/widget-text-model';
import { createCustomElement } from '@angular/elements';
import { DynamicValueComponent } from './dynamic-value.component';
import { DynamicDataFetcherService } from './dynamic-data-fetcher.service';
import { Subscription } from 'rxjs';

@Directive({ selector: '[wrapper]', standalone: true })
class WrapperDirective {}

@Component({
  selector: 'test-widgets-widgets-widget-text-ui',
  standalone: true,
  imports: [WrapperDirective],
  template: `
    <div
      [style.backgroundColor]="data.backgroundColor"
      [class.center]="data.displayCenter"
      wrapper
    >
      <span
        [style.visibility]="okToShow ? 'visible' : 'hidden'"
        [innerHtml]="html"
      ></span>
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
     
           span {
             display: block;
           }
         `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetsWidgetTextUiComponent
  implements AdComponent<WidgetText>, OnInit, OnDestroy, AfterViewInit
{
  @Input() data: WidgetText = {
    value: 'Salut',
    displayCenter: true,
    backgroundColor: 'white',
  };

  @ViewChild(WrapperDirective, { read: ElementRef })
  wrapper!: ElementRef<HTMLDivElement>;

  html: SafeHtml = '';

  sanitizer = inject(DomSanitizer);

  dynamicDataFetcher = inject(DynamicDataFetcherService);
  changeDetectorRef = inject(ChangeDetectorRef);

  okToShow = false;

  dynamicValueInfoSubscription: Subscription | null = null;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    const curly = new RegExp('dynamic-value-id="([A-Za-z0-9-]*)', 'gi');
    const dynamicValueIds = Array.from(
      this.data.value.matchAll(curly),
      (m) => m[1]
    );

    // If no dynamic-value, show immediatly content
    if (dynamicValueIds.length === 0) {
      this.okToShow = true;
      this.html = this.sanitizer.bypassSecurityTrustHtml(this.data.value);
      this.changeDetectorRef.markForCheck();
      return;
    }

    const labelElement = 'dynamic-value';
    if (!customElements.get(labelElement)) {
      const element = createCustomElement(DynamicValueComponent, {
        injector: this.injector,
      });
      customElements.define(labelElement, element);
    }

    this.html = this.sanitizer.bypassSecurityTrustHtml(this.data.value);

    const dynamicValueInfos: DynamicValueInfo[] = [];

    this.dynamicValueInfoSubscription =
      this.dynamicDataFetcher.dynamicValueInfo$.subscribe(
        (dynamicValueInfo) => {
          dynamicValueInfos.push(dynamicValueInfo);

          const dynamicValueInfosWithoutDuplicateIds = new Set([
            ...dynamicValueInfos.map(
              (dynamicValueInfo) => dynamicValueInfo.dynamicValueId
            ),
          ]);

          // If all calls are resolved
          if (
            dynamicValueInfosWithoutDuplicateIds.size === dynamicValueIds.length
          ) {
            for (const dynamicValueIdWithReady of dynamicValueInfos) {
              if (dynamicValueIdWithReady.state === 'error') {
                this.html = this.sanitizer.bypassSecurityTrustHtml(
                  dynamicValueIdWithReady.message
                );
                this.okToShow = true;
                this.changeDetectorRef.markForCheck();
                return;
              }
            }

            this.okToShow = true;
            this.changeDetectorRef.markForCheck();
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.dynamicValueInfoSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (this.data.displayCenter) {
      return;
    }

    const child = this.wrapper.nativeElement.firstChild as HTMLSpanElement;
    const diffHeight =
      this.wrapper.nativeElement.offsetHeight - child.offsetHeight;
    const childTooBig = diffHeight < 0;

    if (!childTooBig) {
      return;
    }

    this.animate(child, diffHeight);
  }

  async animate(child: HTMLSpanElement, diffHeight: number) {
    const start = 'translateY(0px)';
    const end = `translateY(${diffHeight}px)`;
    child.style.transform = start;

    const scaleKeyframes = [
      { transform: start },
      {
        transform: end,
      },
    ];

    const scaleTiming: KeyframeAnimationOptions = {
      delay: 1000,
      duration: 2100,
      easing: 'ease-in-out',
    };

    const childAnimation = child.animate(scaleKeyframes, scaleTiming);
    await wrapOnFinish(childAnimation);
    child.style.transform = end;
    console.log('finished');
    await wait(1000);
    this.animate(child, diffHeight);
  }
}

function wrapOnFinish(animation: Animation) {
  return new Promise((resolve) => {
    animation.onfinish = (ev: AnimationPlaybackEvent) => {
      resolve(animation);
    };
  });
}

function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
