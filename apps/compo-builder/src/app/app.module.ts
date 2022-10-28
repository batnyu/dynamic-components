import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WidgetAssemblerComponent } from '@test-widgets/widget-assembler';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, WidgetAssemblerComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
