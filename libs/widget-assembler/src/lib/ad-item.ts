import { Type } from '@angular/core';

// export class AdItem {
//   constructor(public component: Type<any>, public data: any) {}
// }

export type AdItem = {
  getComponent: () => Promise<Type<any>>;
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
  | { kind: 'hero-profile'; data: HeroProfile };
