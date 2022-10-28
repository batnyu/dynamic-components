import { Injectable } from '@angular/core';
import { AdItem } from './ad-item';

@Injectable()
export class AdService {
  getAds(): AdItem[] {
    return [
      {
        getComponent: () =>
          import('./hero-profile.component').then(
            (a) => a.HeroProfileComponent
          ),
        pos: {
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        },
        kind: 'hero-profile',
        data: {
          name: 'Bombasto',
          bio: 'Brave as they come',
        },
      },
      {
        getComponent: () =>
          import('./hero-profile.component').then(
            (a) => a.HeroProfileComponent
          ),
        pos: {
          x: 50,
          y: 0,
          width: 50,
          height: 50,
        },
        kind: 'hero-profile',
        data: {
          name: 'Dr. IQ',
          bio: 'Smart as they come',
        },
      },
      {
        getComponent: () =>
          import('./hero-job-ad.component').then((a) => a.HeroJobAdComponent),
        pos: {
          x: 0,
          y: 50,
          width: 50,
          height: 50,
        },
        kind: 'hero-job-ad',
        data: {
          headline: 'Hiring for several positions',
          body: 'Submit your resume today!',
        },
      },
      {
        getComponent: () =>
          import('./hero-job-ad.component').then((a) => a.HeroJobAdComponent),
        pos: {
          x: 50,
          y: 50,
          width: 50,
          height: 50,
        },
        kind: 'hero-job-ad',
        data: {
          headline: 'Openings in all departments',
          body: 'Apply today',
        },
      },
    ];
  }
}
