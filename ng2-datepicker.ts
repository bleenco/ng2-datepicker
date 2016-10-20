export { DatePickerModule } from './src/ng2-datepicker.module';

export * from './src/models';

export { DatePicker } from './src/decorators/datepicker';
export { extendConfig } from './src/decorators/aot-utils';

export { BaseSelect } from './src/selections/base.select';
/* should we ? only use case I see is user extending it
export { SingleSelectDirective } from './src/selections/single.select';
export { MultiSelectDirective } from './src/selections/multi.select';
*/

export { DatePickerTemplate } from './src/components/datepicker.template';
export { DEFAULT_CONFIG, DatePickerIonicComponent } from './src/components/ionic/datepickerionic';
