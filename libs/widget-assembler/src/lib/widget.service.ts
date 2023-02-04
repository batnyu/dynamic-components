import { Injectable } from '@angular/core';
import type { Widget } from '@test-widgets/shared-utils';

@Injectable()
export class WidgetService {
  getWidgets(): Widget[] {
    return [
      {
        kind: 'text',
        data: {
          value: '<span>Hello bro 4</span>',
          displayCenter: true,
          backgroundColor: 'lightblue',
        },
        pos: {
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        },
      },

      {
        kind: 'text',
        data: {
          value:
            '<span style="font-size: 50px; font-weight: bold">Hello bro 3</span>',
          displayCenter: true,
          backgroundColor: 'lightgreen',
        },
        pos: {
          x: 50,
          y: 0,
          width: 50,
          height: 50,
        },
      },

      {
        kind: 'text',
        data: {
          value:
            '<span style="font-size: 100px;">Hello, je suis un texte beaucoup trop long et je dois scroller mais pas trop non plus frero</span>',
          displayCenter: false,
          backgroundColor: 'red',
        },
        pos: {
          x: 0,
          y: 50,
          width: 50,
          height: 50,
        },
      },
      {
        kind: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1667561420668-3441555cabc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80',
          objectFit: 'contain',
          backgroundColor: 'orange',
        },
        pos: {
          x: 50,
          y: 50,
          width: 50,
          height: 50,
        },
      },
    ];
  }
}
