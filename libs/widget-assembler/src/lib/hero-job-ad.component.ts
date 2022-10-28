import { Component, Input } from '@angular/core';
import { HeroJobAdInput } from './ad-item';

import { AdComponent } from './ad.component';

@Component({
  standalone: true,
  template: `
    <div class="job-ad">
      <span>{{ data.headline }}</span>
      {{ data.body }}
    </div>
  `,
  styles: [
    `
      .job-ad {
        width: 100%;
        height: 100%;
        background-color: yellow;
      }
    `,
  ],
})
export class HeroJobAdComponent implements AdComponent<HeroJobAdInput> {
  @Input() data: HeroJobAdInput = {
    headline: 'headline',
    body: 'body',
  };
}
