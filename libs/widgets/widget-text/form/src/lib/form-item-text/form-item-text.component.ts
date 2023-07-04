import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  EditorComponent,
  EditorModule,
  TINYMCE_SCRIPT_SRC,
} from '@tinymce/tinymce-angular';
import { EditorConfig } from './editor-config';
import {
  ControlContainer,
  ControlValueAccessor,
  UntypedFormControl,
  FormControlDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';
import { EventObj } from '@tinymce/tinymce-angular/editor/Events';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'lumiplan-form-item-text',
  templateUrl: './form-item-text.component.html',
  styleUrls: ['./form-item-text.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemTextComponent),
      multi: true,
    },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormItemTextComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @Input() formControl!: UntypedFormControl;
  @Input() formControlName = '';
  @Input() backgroundColor = '#000000FF';
  @Input() backgroundColorFallback = '#000000FF';
  @Input() id = '1';

  @Output() isEmpty = new EventEmitter<null>();

  get control() {
    return (
      this.formControl ||
      (this.controlContainer &&
        this.controlContainer.control &&
        (this.controlContainer.control.get(
          this.formControlName
        ) as UntypedFormControl))
    );
  }

  editorConfig: EditorConfig = EditorConfig.editorConfig;

  showEditor = false;
  loadingEditor = true;

  keyUpEvent = new EventEmitter<EventObj<KeyboardEvent>>();

  wasEmpty = true;

  @ViewChild('editor') editorComponent!: EditorComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private controlContainer: ControlContainer,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    Promise.resolve().then(() => {
      this.showEditor = true;
      this.changeDetectorRef.detectChanges();
      this.control.valueChanges
        .pipe(untilDestroyed(this), debounceTime(300))
        .subscribe(() => {
          this.checkEmpty();
        });

      this.keyUpEvent
        .pipe(untilDestroyed(this), debounceTime(300))
        .subscribe(() => {
          this.checkEmpty();
        });

      setTimeout(() => {
        this.editorComponent?.editor?.on('click', (e) => {
          const element = e.target as Element;
          const tagName = element.tagName;
          console.dir(element);

          if (tagName === 'DYNAMIC-VALUE') {
            // open modal if click on dynamic-value component
            const config = {
              type: 'poi',
              id: 1,
            };
            const configStr = JSON.stringify(config);
            // this.matDialog.open()

            this.editorComponent.editor.dom.setAttrib(
              element,
              'config',
              configStr
            );
          }
        });
      }, 1500);
    });
  }

  onInit() {
    this.loadingEditor = false;
  }

  writeValue(obj: any): void {
    this.formControlDirective?.valueAccessor?.writeValue(obj);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    // this.formControlDirective?.valueAccessor?.setDisabledState(isDisabled);
  }

  onKeyUp(event: EventObj<KeyboardEvent>) {
    this.keyUpEvent.emit(event);
  }

  checkEmpty(): void {
    const textContent = this.editorComponent?.editor?.getContent({
      format: 'text',
    });
    if (
      textContent?.length === 0 ||
      (textContent?.length === 1 && textContent?.charCodeAt(0) === 8205)
    ) {
      setTimeout(() => {
        this.wasEmpty = true;
        this.isEmpty.emit();
      }, 300);
    } else {
      if (this.wasEmpty) {
        setTimeout(() => {
          this.wasEmpty = false;
        }, 300);
      }
    }
  }

  ngAfterViewInit(): void {}
}
