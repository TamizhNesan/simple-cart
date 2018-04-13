import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
