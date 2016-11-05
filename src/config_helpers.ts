import { Component, Directive } from '@angular/core';

function concatArr(defaultArr, newArr) {
  return defaultArr ?
          (newArr ? defaultArr.concat(newArr) : defaultArr) :
          newArr;
}

export function extendDirConfig(defaultConfig: Directive, config: Directive): Directive {
  return {
    providers:        concatArr( defaultConfig.providers, config.providers ),
    inputs:           concatArr( defaultConfig.inputs, config.inputs ),
    outputs:          concatArr( defaultConfig.outputs, config.outputs ),

    queries: Object.assign({}, defaultConfig.queries, config.queries),
    host: Object.assign({}, defaultConfig.host, config.host),

    selector: config.selector || defaultConfig.selector,
    exportAs: config.exportAs || defaultConfig.exportAs,
  };
}

export function extendConfig(defaultConfig: Component, config: Component): Component {
  return Object.assign(extendDirConfig(defaultConfig, config), {
    template:    (config.template || config.templateUrl) ? config.template : defaultConfig.template,
    templateUrl: (config.template || config.templateUrl) ? config.templateUrl : defaultConfig.templateUrl,

    styles:      (config.styles || config.styleUrls) ? config.styles : defaultConfig.styles,
    styleUrls:   (config.styles || config.styleUrls) ? config.styleUrls : defaultConfig.styleUrls,

    moduleId: (config.templateUrl || config.styleUrls) ? config.moduleId :
                ( (!config.template && defaultConfig.templateUrl) || (!config.styles && defaultConfig.styleUrls) ?
                  defaultConfig.moduleId : undefined),

    viewProviders:    concatArr( defaultConfig.viewProviders, config.viewProviders ),
    animations:       concatArr( defaultConfig.animations, config.animations ),
    entryComponents:  concatArr( defaultConfig.entryComponents, config.entryComponents ),

    changeDetection: config.changeDetection || defaultConfig.changeDetection,
    encapsulation: config.encapsulation || defaultConfig.encapsulation,
    interpolation: config.interpolation || defaultConfig.interpolation
  });
}

import { Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export function formProvider(componentClass: Function): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => componentClass),
    multi: true
  };
}

import { BaseSelect } from './selections/base.select';

export function selectProvider(directiveClass: Function): Provider {
  return {
    provide: BaseSelect, useExisting: forwardRef(() => directiveClass)
  };
}
