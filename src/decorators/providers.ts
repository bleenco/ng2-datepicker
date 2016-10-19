import { Component, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export function dpProviders(component: any, providers: Provider[] = []): Provider[] {
  return [...providers, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true
  }];
}

export function extendConfig(defaultConfig: Component, componentClass: Function, config: Component): Component {
  return {
    template:    (config.template || config.templateUrl) ? config.template : defaultConfig.template,
    templateUrl: (config.template || config.templateUrl) ? config.templateUrl : defaultConfig.templateUrl,

    styles:      (config.styles || config.styleUrls) ? config.styles : defaultConfig.styles,
    styleUrls:   (config.styles || config.styleUrls) ? config.styleUrls : defaultConfig.styleUrls,

    providers: dpProviders(componentClass, config.providers),

    //for the rest just copy... in a painful way...
    selector: config.selector,
    inputs: config.inputs,
    outputs: config.outputs,
    host: config.host,
    exportAs: config.exportAs,
    queries: config.queries,
    changeDetection: config.changeDetection,
    viewProviders: config.viewProviders,
    moduleId: config.moduleId,
    animations: config.animations,
    encapsulation: config.encapsulation,
    interpolation: config.interpolation,
    entryComponents: config.entryComponents
  };
}
