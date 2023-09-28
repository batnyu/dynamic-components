import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import {
  SlideService,
  WidgetAssemblerComponent,
} from '@test-widgets/widget-assembler';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WidgetsWidgetTextFormComponent } from '@test-widgets/widget-text-form';
import { GuardTypePipe } from '@test-widgets/shared-utils';
import { MatDialogModule } from '@angular/material/dialog';
import {
  tooltipVariation,
  popperVariation,
  provideTippyConfig,
} from '@ngneat/helipopper';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WidgetAssemblerComponent,
    WidgetsWidgetTextFormComponent,
    GuardTypePipe,
    MatDialogModule,
    HttpClientModule,
    MatNativeDateModule,
  ],
  providers: [
    SlideService,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
