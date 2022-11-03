import { Component, inject } from '@angular/core';
import { AdItem } from '@test-widgets/shared-utils';
import { AdService } from '@test-widgets/widget-assembler';
import { WidgetText } from '@test-widgets/widget-text-model';

@Component({
  selector: 'test-widgets-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  ads: AdItem[] = [];

  private adService = inject(AdService);

  ngOnInit() {
    this.ads = this.adService.getAds();
  }

  onFormChange(widgetText: WidgetText) {
    this.ads = this.ads.map((ad) =>
      ad.kind === 'text'
        ? { ...ad, data: { ...ad.data, value: widgetText.value } }
        : ad
    );

    console.log('this.ads', this.ads);
  }
}
