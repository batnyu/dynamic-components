import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdItem } from '../ad-item';
import { AdService } from '../ad.service';
import { AdBannerComponent } from '../ad-banner.component';

@Component({
  selector: 'test-widgets-widget-assembler',
  standalone: true,
  imports: [CommonModule, AdBannerComponent],
  providers: [AdService],
  templateUrl: './widget-assembler.component.html',
  styleUrls: ['./widget-assembler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetAssemblerComponent implements OnInit {
  ads: AdItem[] = [];

  private adService = inject(AdService);

  ngOnInit() {
    this.ads = this.adService.getAds();
  }
}
