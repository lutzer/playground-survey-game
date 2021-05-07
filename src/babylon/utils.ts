import { minBy } from 'lodash'
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
  
  function easeInOut(t : number) : number { 
    return t<.5 ? 2*t*t : -1+(4-2*t)*t 
  }
  
  const timeBetweenSteps = time/steps
  interval(timeBetweenSteps).pipe(scan( (acc) => {
    return acc + 1/steps
  }, 0), takeWhile((t) => t < 1)).subscribe({
    next: (t) => {
      callback(from + (to-from) * easeInOut(t), false)
    },
    complete: () => {
      callback(to, true)
    }
  })
}

function snapTo(value : number, snapPositions : number[]) : number {
  return minBy(snapPositions, (p) => {
    return Math.abs(value - p)
  }) || value
}

function constrainRad(value: number) : number {
  while ( value < 0) {
    value += Math.PI * 2
  }
  while (value > Math.PI * 2) {
    value -= Math.PI * 2
  }
  return value
}

function radDifference(value1: number, value2: number) : number {
  const diff = value1 - value2
  return (diff + Math.PI) % (Math.PI * 2) - Math.PI
}

export { fromHammerEvent, animateValue, radDifference, constrainRad, snapTo }