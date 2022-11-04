import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import type { WidgetImage } from '@test-widgets/widget-image-model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import type { ControlsOf } from '@test-widgets/shared-utils';

@Component({
  selector: 'test-widgets-widgets-widget-image-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './widgets-widget-image-form.component.html',
  styleUrls: ['./widgets-widget-image-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetsWidgetImageFormComponent implements OnInit {
  widgetImageForm = new FormGroup<ControlsOf<WidgetImage>>({
    objectFit: new FormControl('cover', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    src: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    backgroundColor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    console.log('form value', this.widgetImageForm.value);
  }
}
