import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WidgetImage } from '@test-widgets/widget-image-model';
import type { AdComponent } from '@test-widgets/shared-utils';

@Component({
  selector: 'test-widgets-widgets-widget-image-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widgets-widget-image-ui.component.html',
  styleUrls: ['./widgets-widget-image-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetsWidgetImageUiComponent
  implements AdComponent<WidgetImage>, OnInit
{
  @Input() data: WidgetImage = {
    src: '',
    objectFit: 'cover',
    backgroundColor: 'white',
  };

  constructor() {}

  ngOnInit(): void {}
}
