import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdItem } from '@test-widgets/shared-utils';
import { AdBannerComponent } from '../ad-banner.component';

@Component({
  selector: 'test-widgets-widget-assembler',
  standalone: true,
  imports: [CommonModule, AdBannerComponent],
  templateUrl: './widget-assembler.component.html',
  styleUrls: ['./widget-assembler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetAssemblerComponent {
  @Input() ads: AdItem[] = [];
}
