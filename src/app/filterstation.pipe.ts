import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterstation',
    pure: false
})
export class FilterStationPipe implements PipeTransform {
    transform(items: any[], station: string): any {
        if (!items || !station) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.current_station == station);
    }
}
