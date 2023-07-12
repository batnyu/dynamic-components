import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DynamicValueInfo } from '@test-widgets/widget-text-model';

@Injectable({
  providedIn: 'root',
})
export class DynamicDataFetcherService {
  dynamicValueInfoSubject = new Subject<DynamicValueInfo>();
  dynamicValueInfo$ = this.dynamicValueInfoSubject.asObservable();
  constructor() {}
}
