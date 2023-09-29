import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  SlideService,
  WidgetAssemblerComponent,
} from '@test-widgets/widget-assembler';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, WidgetAssemblerComponent],
  providers: [SlideService],
  bootstrap: [AppComponent],
})
export class AppModule {}
