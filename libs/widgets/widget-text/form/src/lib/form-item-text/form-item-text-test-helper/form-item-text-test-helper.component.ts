import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormItemTextComponent } from '../form-item-text.component';

@UntilDestroy()
@Component({
  selector: 'lumiplan-form-item-text-test-helper',
  templateUrl: './form-item-text-test-helper.component.html',
  styleUrls: ['./form-item-text-test-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormItemTextComponent],
})
export class FormItemTextTestHelperComponent {
  myGroup: UntypedFormGroup;

  value = '';
  isEmpty = false;

  constructor(
    private fb: UntypedFormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.myGroup = this.fb.group({
      text: this.fb.control(
        '<div><p style="text-align: center;"><span class="lmp_normal">Your text</span></p></div>'
      ),
    });

    this.myGroup.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.value = JSON.stringify(value, null, 2);
      this.changeDetectorRef.markForCheck();
    });
  }
}
