import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  WidgetService,
  WidgetAssemblerComponent,
} from '@test-widgets/widget-assembler';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WidgetsWidgetTextFormComponent } from '@test-widgets/widget-text-form';
import { GuardTypePipe } from '@test-widgets/shared-utils';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WidgetAssemblerComponent,
    WidgetsWidgetTextFormComponent,
    GuardTypePipe,
  ],
  providers: [WidgetService],
  bootstrap: [AppComponent],
})
export class AppModule {}
