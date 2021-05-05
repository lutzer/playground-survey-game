import { Observable } from 'rxjs/internal/Observable'
import { interval } from 'rxjs/internal/observable/interval'
import { scan } from 'rxjs/internal/operators/scan'
import { share } from 'rxjs/internal/operators/share'
import { takeWhile } from 'rxjs/internal/operators/takeWhile'
import { Subject } from 'rxjs/internal/Subject'

const fromHammerEvent = function(hammer: HammerManager, event: string) : Observable<HammerInput> {
  const subject = new Subject<HammerInput>()
  hammer.on(event,(e: HammerInput) => {
    subject.next(e)
  })
  return subject.pipe(share())
}

const animateValue = function(from: number, to:number, time : number, steps = time/40, callback : (v : number, finished: boolean) => void) : void {
  const timeBetweenSteps = time/steps
  interval(timeBetweenSteps).pipe(scan( (acc) => {
    return acc + 1/steps
  }, 0), takeWhile((t) => t < 1)).subscribe({
    next: (t) => {
      callback(from + (to-from) * t, false)
    },
    complete: () => {
      callback(to, true)
    }
  })
}

export { fromHammerEvent, animateValue }