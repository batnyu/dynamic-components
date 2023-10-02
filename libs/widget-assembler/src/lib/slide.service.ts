import { Injectable } from '@angular/core';
import type { Slide } from '@test-widgets/shared-utils';

@Injectable()
export class SlideService {
  getSlide(): Slide {
    return {
      style: {},
      fontsWithSizeAndLineHeight: [
        {
          name: 'lmp_smaller',
          fontSize: '8px',
          lineHeight: '8px',
        },
        {
          name: 'lmp_small',
          fontSize: '16px',
          lineHeight: '16px',
        },
        {
          name: 'lmp_normal',
          fontSize: '32px',
          lineHeight: '32px',
        },
        {
          name: 'lmp_big',
          fontSize: '64px',
          lineHeight: '64px',
        },
        {
          name: 'lmp_bigger',
          fontSize: '128px',
          lineHeight: '128px',
        },
      ],
      widgets: [
        {
          kind: 'text',
          data: {
            value:
              '<div style="color: #ffffff; width: 100%;"><p style="font-family: Arial,serif; text-align: center;"><span class="lmp_normal">&#8205;salut <dynamic-value class="mceNonEditable" contenteditable="false" dynamic-value-id="idtest" config=\'{"kind": "poi","id": 42, "field": "associateMessage", "lang": "fr_FR"}\'>POI name</dynamic-value></span></p></div>',
            displayCenter: true,
            backgroundColor: 'lightblue',
          },
          pos: {
            x: 0,
            y: 0,
            width: 50,
            height: 50,
          },
          style: {
            left: 0,
            top: 0,
            width: '50vw',
            height: '50vh',
          },
        },

        {
          kind: 'text',
          data: {
            value: '<span class="lmp_big">Hello</span>',
            displayCenter: true,
            backgroundColor: 'lightgreen',
          },
          pos: {
            x: 50,
            y: 0,
            width: 50,
            height: 50,
          },
          style: {
            left: '50vw',
            top: 0,
            width: '50vw',
            height: '50vh',
          },
        },

        {
          kind: 'text',
          data: {
            value:
              '<span style="font-size: 40px;">Hello, je suis un texte beaucoup trop long et je dois scroller mais pas trop non plus</span>',
            displayCenter: false,
            backgroundColor: 'red',
          },
          pos: {
            x: 0,
            y: 50,
            width: 50,
            height: 50,
          },
          style: {
            left: 0,
            top: '50vh',
            width: '50vw',
            height: '50vh',
          },
        },
        {
          kind: 'image',
          data: {
            src: 'assets/image/photo.jpg',
            objectFit: 'contain',
            backgroundColor: 'orange',
          },
          pos: {
            x: 50,
            y: 50,
            width: 50,
            height: 50,
          },
          style: {
            left: '50vw',
            top: '50vh',
            width: '50vw',
            height: '50vh',
          },
        },
      ],
    };
  }
}
