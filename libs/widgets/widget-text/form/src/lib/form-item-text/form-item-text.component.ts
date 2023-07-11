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
  OnDestroy,
  NgZone,
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
import { TippyInstance, TippyService } from '@ngneat/helipopper';
import { DynamicValueChooserDialogComponent } from '../dynamic-value-chooser-dialog/dynamic-value-chooser-dialog.component';
import { DynamicValueConfig } from '@test-widgets/widget-text-model';

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
  implements OnInit, OnDestroy, ControlValueAccessor
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

  tippy: TippyInstance | null = null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private controlContainer: ControlContainer,
    private tippyService: TippyService,
    private ngZone: NgZone
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
    });
  }

  ngOnDestroy() {
    // this.tippy?.destroy();
  }

  onInit() {
    this.loadingEditor = false;

    this.editorComponent?.editor?.on('click', (e) => {
      const element = e.target as Element;
      const parentElement = element.parentElement;
      if (!parentElement) {
        return;
      }

      const tagName = parentElement?.tagName;

      if (tagName === 'DYNAMIC-VALUE') {
        this.tippy?.destroy();

        // open modal if click on dynamic-value component
        const configAttribute =
          parentElement?.attributes.getNamedItem('config');

        if (!configAttribute) {
          return;
        }

        const config = JSON.parse(configAttribute.value);

        this.ngZone.run(() => {
          this.tippy = this.tippyService.create(
            parentElement,
            DynamicValueChooserDialogComponent,
            {
              variation: 'popper',
              data: {
                config,
                fnToUpdate: (newConfig: DynamicValueConfig) => {
                  this.editorComponent?.editor?.dom.setAttrib(
                    parentElement,
                    'config',
                    JSON.stringify(newConfig)
                  );

                  this.control.setValue(
                    this.editorComponent?.editor?.getContent()
                  );
                  this.tippy?.hide();
                },
              },
              appendTo: (ref) => {
                return (ref.closest('editor') as HTMLElement) ?? undefined;
              },
              zIndex: 200,
              showOnCreate: true,
            }
          );
        });
      }
    });
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
}
