import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import {
  popperVariation,
  provideTippyConfig,
  tooltipVariation,
} from '@ngneat/helipopper';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MatDialogModule, MatNativeDateModule),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory:
        (matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) =>
        async () => {
          const icons = [
            {
              path: 'assets/dynamic-value.svg',
              iconName: 'dynamic-value',
            },
          ];

          for (const icon of icons) {
            matIconRegistry.addSvgIcon(
              icon.iconName,
              domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
            );
          }
        },
      deps: [MatIconRegistry, DomSanitizer],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};
