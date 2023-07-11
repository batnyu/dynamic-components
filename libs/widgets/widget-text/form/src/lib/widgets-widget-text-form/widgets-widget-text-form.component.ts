import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { WidgetText } from '@test-widgets/widget-text-model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlsOf } from '@test-widgets/shared-utils';
import { FormItemTextComponent } from '../form-item-text/form-item-text.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'test-widgets-widgets-widget-text-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormItemTextComponent,
    MatButtonModule,
  ],
  templateUrl: './widgets-widget-text-form.component.html',
  styleUrls: ['./widgets-widget-text-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetsWidgetTextFormComponent implements OnInit {
  @Input() data: WidgetText = {
    value: 'Salut',
    displayCenter: true,
    backgroundColor: 'white',
  };

  widgetTextForm = new FormGroup<ControlsOf<WidgetText>>({
    value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    displayCenter: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    backgroundColor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  @Output() onFormChange = new EventEmitter<WidgetText>();

  constructor() {}

  ngOnInit(): void {
    this.widgetTextForm.setValue(this.data);

    // this.widgetTextForm.valueChanges.subscribe((value) => {
    //   console.log('value', value);
    //   this.onSubmit();
    // });
  }

  onSubmit() {
    const value = this.widgetTextForm.getRawValue();
    this.onFormChange.emit(value);
  }
}
