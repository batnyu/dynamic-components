import { Component, inject, OnInit } from '@angular/core';
import { Slide } from '@test-widgets/shared-utils';
import { SlideService } from '@test-widgets/widget-assembler';

@Component({
  selector: 'test-widgets-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  slide: Slide = {
    style: {},
    widgets: [],
    fontsWithSizeAndLineHeight: [],
  };

  private slideService = inject(SlideService);

  ngOnInit() {
    this.slide = this.slideService.getSlide();
  }
}
