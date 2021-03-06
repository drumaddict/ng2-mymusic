import {Pipe, PipeTransform} from 'angular2/core';
@Pipe({name: 'keys_values'})
export class KeysValuesPipe implements PipeTransform {
  transform(value: any, args?: any[]): Object[] {
      let keyArr = Object.keys(value),
          valuesArr = [],
          keysArr = [],
          keyName = args[0] ? args[0] : null,
          keys_and_values = [];
      keyArr.forEach(key => {
        if (keyName) { value[key][keyName] = key; };
         valuesArr.push(value[key])
         keysArr.push(key)
         keys_and_values.push([key, value[key]])
      });
      if(args[1]) {
        keysArr.sort((a: Object, b: Object): number => {
              return a[keyName] > b[keyName] ? 1 : -1;
          });
      }
      return keys_and_values;
  }
}