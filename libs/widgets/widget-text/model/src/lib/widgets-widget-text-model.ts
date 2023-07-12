export interface WidgetText {
  value: string;
  displayCenter: boolean;
  backgroundColor: string;
}

export type DynamicValueConfig =
  | PoiDynamicValueConfig
  | { kind: 'unset' }
  | { kind: 'skier'; id: number };

export type PoiDynamicValueConfig = {
  kind: 'poi';
  id: number;
} & PoiField;

export type PoiField =
  | {
      field: 'associateMessage';
      lang: LanguageType;
    }
  | {
      field: 'time';
      timeGroupIndex: number;
      moment: Moment;
    };

export const ALL_AVAILABLE_LANGUAGES = ['fr_FR', 'en_US'] as const;
export type LanguageType = typeof ALL_AVAILABLE_LANGUAGES[number];

export const ALL_MOMENTS = ['begin', 'end'] as const;
export type Moment = typeof ALL_MOMENTS[number];

export type DynamicValueInfo = {
  dynamicValueId: string;
} & DynamicValueInfoState;

export type DynamicValueInfoState =
  | {
      state: 'ok';
    }
  | {
      state: 'error';
      message: string;
    };
