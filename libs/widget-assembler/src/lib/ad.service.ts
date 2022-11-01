import { Injectable } from '@angular/core';
import { AdItem } from './ad-item';

@Injectable()
export class AdService {
  getAds(): AdItem[] {
    return [
      {
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
