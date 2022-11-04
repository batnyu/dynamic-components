import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsWidgetImageUiComponent } from './widgets-widget-image-ui.component';

describe('WidgetsWidgetImageUiComponent', () => {
  let component: WidgetsWidgetImageUiComponent;
  let fixture: ComponentFixture<WidgetsWidgetImageUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsWidgetImageUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetsWidgetImageUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
