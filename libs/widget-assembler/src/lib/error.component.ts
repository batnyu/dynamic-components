import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WidgetDirective } from './widget.directive';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-error-component',
  imports: [NgFor, WidgetDirective],
  template: ``,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {}
