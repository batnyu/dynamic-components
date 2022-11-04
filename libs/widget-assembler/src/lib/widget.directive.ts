import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[widgetHost]',
  standalone: true,
})
export class WidgetDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
