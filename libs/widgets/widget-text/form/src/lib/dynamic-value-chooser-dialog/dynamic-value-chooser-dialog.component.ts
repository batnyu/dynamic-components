import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ALL_AVAILABLE_LANGUAGES,
  ALL_MOMENTS,
  DynamicValueConfig,
} from '@test-widgets/widget-text-model';

import { TIPPY_REF } from '@ngneat/helipopper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'test-widgets-dynamic-value-chooser-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dynamic-value-chooser-dialog.component.html',
  styleUrls: ['./dynamic-value-chooser-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicValueChooserDialogComponent implements OnInit {
  @ViewChild(NgForm) form!: NgForm;

  tippy = inject(TIPPY_REF);

  model: DynamicValueConfig = {
    kind: 'unset',
  };

  protected readonly ALL_AVAILABLE_LANGUAGES = ALL_AVAILABLE_LANGUAGES;
  protected readonly ALL_MOMENTS = ALL_MOMENTS;

  ngOnInit(): void {
    this.model = this.tippy.data.config;
  }

  close() {
    this.tippy.hide();
  }

  submit() {
    if (this.form.valid) {
      this.tippy.data.fnToUpdate(this.form.value);
    }
  }
}
