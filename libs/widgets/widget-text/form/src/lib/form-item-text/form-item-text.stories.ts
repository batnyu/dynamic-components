import {
  applicationConfig,
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { FormItemTextTestHelperComponent } from './form-item-text-test-helper/form-item-text-test-helper.component';
import { APP_INITIALIZER } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'Design System/Components/Diffusion/Composer/FormItemText',
  argTypes: {},
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory:
            (matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) =>
            async () => {
              const icons = [
                {
                  path: 'assets/images/others/spinner.svg',
                  iconName: 'Spinner',
                },
              ];

              for (const icon of icons) {
                matIconRegistry.addSvgIcon(
                  icon.iconName,
                  domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
                );
              }
            },
          deps: [MatIconRegistry, DomSanitizer],
          multi: true,
        },
      ],
    }),
    moduleMetadata({
      imports: [FormItemTextTestHelperComponent, HttpClientModule],
      providers: [],
    }),
    componentWrapperDecorator(
      (story) =>
        `
          <div [style.width.%]='100'
              [style.height.%]='100'
              class='lumiplay-diffusion'>
            ${story}
          </div>

        `
    ),
  ],
} as Meta;

const Template: Story = (args) => ({
  props: args,
  template: `
      <lumiplan-form-item-text-test-helper></lumiplan-form-item-text-test-helper>
`,
});

export const Default = Template.bind({});
Default.args = {};
