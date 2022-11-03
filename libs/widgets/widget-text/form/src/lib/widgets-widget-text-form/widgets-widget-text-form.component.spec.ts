import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsWidgetTextFormComponent } from './widgets-widget-text-form.component';

describe('WidgetsWidgetTextFormComponent', () => {
  let component: WidgetsWidgetTextFormComponent;
  let fixture: ComponentFixture<WidgetsWidgetTextFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsWidgetTextFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetsWidgetTextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
