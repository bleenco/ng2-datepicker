import { Component, Provider, isDevMode } from '@angular/core';

export interface ExtendsComponentMetadata {
  selector?: string;

  template?:    string;
  templateUrl?: string;
  styles?:      string[];
  styleUrls?:   string[];
  providers?:   Provider[];

  append?: {
    styles?: string[];
    styleUrls?: string[];
    providers?: Provider[];
  };

  //TODO
  //remove?: Component;
  //reduce?: {
  //  styles, styleUrls, providers
  //}
}

export function ExtendsComponent( componentMetadata: ExtendsComponentMetadata ): (cls: any) => any {

  return function (target: Function) {
    let metadata: Component = {};
    let metas: (ExtendsComponentMetadata | Component)[] = [ componentMetadata ];

    //find all metadatas across parents
    let parentTarget = target;
    do {
      parentTarget = Object.getPrototypeOf(parentTarget.prototype).constructor;

      let parentAnnot = Reflect.getMetadata('annotations', parentTarget);
      if (parentAnnot) {
        if (! (parentAnnot instanceof Array) ) {
          //dunno what getMedata() can return just throw until we found a case
          if (isDevMode) throw 'annotations not an array : ' + parentAnnot;
          else continue;
        }

        for ( let annotation of parentAnnot ) {
          /*
            TODO if it's ExtendsComponent
          */

          if (annotation instanceof Component)
            metas.push(annotation);
        }
      }

    } while ( parentTarget !== Object);

    // loop from last to first
    for ( let i = metas.length - 1; i >= 0; i--)
      extendsMetadata(metadata, metas[i]);

    return Component(metadata)(target);
  };
}

function extendsMetadata(source: Component, target: (ExtendsComponentMetadata | Component)) {
  for (let prop in target) {
    let targetValue = target[prop];
    if ( isBlank(targetValue) )
      continue;

    if (prop === 'append') {
      for ( let appendProp in targetValue)
        source[appendProp] = [...source[appendProp], targetValue[appendProp]];
    }
    else
      source[prop] = targetValue;
  };
}

//same func used on angular 2, dunno why they don't export it
function isBlank(v) {
  return v === undefined || v === null;
}

