import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ShortPipe'
})
export class ShortPipe implements PipeTransform {

  transform(value: string, maxLength: number = 40): string {
    if (value.length <= maxLength) {
      return value;
    }
    return value.substring(0, maxLength) + '...';
  }

}
