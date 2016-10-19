import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ExtendsComponent, ExtendsComponentMetadata } from './extendscomponent';

export var DatePicker = function( metadata: ExtendsComponentMetadata ): (cls: any) => any {

  return (target: Function) => {
    metadata.providers = metadata.providers || [];

    metadata.providers.push({
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => target),
      multi: true
    });

    return ExtendsComponent(metadata)(target);
  };
};

