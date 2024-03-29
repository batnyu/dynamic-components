import type { WidgetImage } from '@test-widgets/widget-image-model';
import { FormControl, FormGroup } from '@angular/forms';
import type { WidgetText } from '@test-widgets/widget-text-model';
import { TypeGuard } from './guard-type.pipe';
import type { Properties } from 'csstype';

export interface AdComponent<T> {
  data: T;
  // style: Properties;
}

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};

export interface Slide {
  widgets: Widget[];
  style: Properties;
  fontsWithSizeAndLineHeight: FontWithSize[];
}

export type FontWithSize = {
  name: string;
} & Pick<Properties, 'fontSize' | 'lineHeight'>;

interface Pos {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Widget =
  | { kind: 'text'; data: WidgetText; pos: Pos; style: Properties }
  | { kind: 'image'; data: WidgetImage; pos: Pos; style: Properties };

export type Text = Extract<Widget, { kind: 'text' }>;
export type Image = Extract<Widget, { kind: 'image' }>;

export const isText: TypeGuard<Widget, Text> = (
  widget: Widget
): widget is Text => widget.kind === 'text';

export const isImage: TypeGuard<Widget, Image> = (
  widget: Widget
): widget is Image => widget.kind === 'image';
