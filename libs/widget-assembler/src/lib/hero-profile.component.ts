import { Component, Input } from '@angular/core';
import { HeroProfile } from './ad-item';

import { AdComponent } from './ad.component';

@Component({
  standalone: true,
  template: `
    <div class="hero-profile">
      <span>{{ data.name }}</span>

      <p>{{ data.bio }}</p>

      <strong>Hire this hero today!</strong>
    </div>
  `,
  styles: [
    `
      div {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class HeroProfileComponent implements AdComponent<HeroProfile> {
  @Input() data: HeroProfile = {
    name: 'name',
    bio: 'bio',
  };
}
