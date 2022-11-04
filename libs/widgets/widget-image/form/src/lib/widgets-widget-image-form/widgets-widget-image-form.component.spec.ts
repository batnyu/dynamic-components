import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsWidgetImageFormComponent } from './widgets-widget-image-form.component';

describe('WidgetsWidgetImageFormComponent', () => {
  let component: WidgetsWidgetImageFormComponent;
  let fixture: ComponentFixture<WidgetsWidgetImageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsWidgetImageFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetsWidgetImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
