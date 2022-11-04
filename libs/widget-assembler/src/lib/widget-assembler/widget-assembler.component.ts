import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetBannerComponent } from '../widget-banner.component';
import type { Widget } from '@test-widgets/shared-utils';

@Component({
  selector: 'test-widgets-widget-assembler',
  standalone: true,
  imports: [CommonModule, WidgetBannerComponent],
  templateUrl: './widget-assembler.component.html',
  styleUrls: ['./widget-assembler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetAssemblerComponent {
  @Input() widgets: Widget[] = [];
}
