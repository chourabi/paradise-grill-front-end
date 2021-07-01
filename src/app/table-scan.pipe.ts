import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableScan'
})
export class TableScanPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
