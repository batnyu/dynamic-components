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
        kind: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1667561420668-3441555cabc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80',
          objectFit: 'contain',
          backgroundColor: 'orange',
        },
      },
    ];
  }
}
