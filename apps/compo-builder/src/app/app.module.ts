import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WidgetAssemblerComponent } from '@test-widgets/widget-assembler';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WidgetsWidgetTextFormComponent } from '@test-widgets/widget-text-form';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WidgetAssemblerComponent,
    WidgetsWidgetTextFormComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
