import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class PrepTimePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value != null) {
      var str='';

      if (value < 60) {
        str = value+' min';
      }else if (value >= 60) {
        str = ''+( (value/60).toFixed() )+' h'+' '+( value%60)+' min'
      }
    }

    return '--'
  }

}
