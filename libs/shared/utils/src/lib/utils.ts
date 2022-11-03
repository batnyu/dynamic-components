import { FormControl, FormGroup } from '@angular/forms';
import type { WidgetText } from '@test-widgets/widget-text-model';

export interface AdComponent<T> {
  data: T;
}

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};

export type AdItem = {
  pos: Pos;
} & Widget;

interface Pos {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Widget = { kind: 'text'; data: WidgetText };
