import { Injectable } from '@angular/core';
import { AdItem } from '@test-widgets/shared-utils';

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
        kind: 'text',
        data: {
          value: 'Hello bro',
          displayCenter: true,
          backgroundColor: 'red',
        },
      },
      {
        pos: {
          x: 50,
          y: 0,
          width: 50,
          height: 50,
        },
        kind: 'text',
        data: {
          value: 'Hello bro 3 ',
          displayCenter: true,
          backgroundColor: 'lightgreen',
        },
      },
      {
        pos: {
          x: 0,
          y: 50,
          width: 50,
          height: 50,
        },
        kind: 'text',
        data: {
          value: 'Hello bro 4',
          displayCenter: true,
          backgroundColor: 'lightblue',
        },
      },
      {
        pos: {
          x: 50,
          y: 50,
          width: 50,
          height: 50,
        },
        kind: 'text',
        data: {
          value: 'Hello bro 5',
          displayCenter: true,
          backgroundColor: 'lightgrey',
        },
      },
    ];
  }
}
