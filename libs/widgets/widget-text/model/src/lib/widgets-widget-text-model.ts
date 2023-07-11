export interface WidgetText {
  value: string;
  displayCenter: boolean;
  backgroundColor: string;
}

export type DynamicValueConfig =
  | {
      kind: 'poi';
      id: number;
    }
  | { kind: 'unset' }
  | { kind: 'skier'; id: number };
