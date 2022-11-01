import { WidgetText } from '@test-widgets/widget-text-model';

export type AdItem = {
  pos: Pos;
} & Widget;

interface Pos {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeroJobAdInput {
  headline: string;
  body: string;
}

export interface HeroProfile {
  name: string;
  bio: string;
}

export type Widget =
  | { kind: 'hero-job-ad'; data: HeroJobAdInput }
  | { kind: 'hero-profile'; data: HeroProfile }
  | { kind: 'text'; data: WidgetText };
