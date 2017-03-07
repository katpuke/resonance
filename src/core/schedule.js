// @flow weak

import { timer, timeout } from 'd3-timer';

export const CREATED = 0;
export const SCHEDULED = 1;
export const STARTING = 2;
export const STARTED = 3;
export const RUNNING = 4;
export const ENDING = 5;
export const ENDED = 6;

export default function (node, ref:string, id:number, timing, tweens, events = {}) {
  const schedules = node.TRANSITION_SCHEDULES;

  if (!schedules) {
    node.TRANSITION_SCHEDULES = {}; // eslint-disable-line no-param-reassign
  } else if (id in schedules) {
    return;
  }

  const { time, delay, duration, ease } = timing;

  create(node, id, {
    ref,
    events,
    tweens,
    time,
    delay,
    duration,
    ease,
    timer: null,
    state: CREATED,
  });
}

function create(node, id:number, config) {
  const schedules = node.TRANSITION_SCHEDULES;

  // Initialize the transition timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  const transition = { ...config };
  const n = transition.tweens.length;
  const tweens = new Array(n);

  schedules[id] = transition;
  transition.timer = timer(schedule, 0, transition.time);

  function schedule(elapsed) {
    transition.state = SCHEDULED;
    transition.timer.restart(start, transition.delay, transition.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (transition.delay <= elapsed) {
      start(elapsed - transition.delay);
    }
  }

  function start(elapsed) { // eslint-disable-line consistent-return
    // If the state is not SCHEDULED, then we previously errored on start.
    if (transition.state !== SCHEDULED) return stop();

    for (const sid in schedules) { // eslint-disable-line
      const s = schedules[sid];

      if (s.ref !== transition.ref) {
        continue; // eslint-disable-line no-continue
      }

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (s.state === STARTED) return timeout(start);

      // 1. Interrupt the active transition, if any. dispatch the interrupt event.
      // 2. Cancel any pre-empted transitions. No interrupt event is dispatched
      // because the cancelled transitions never started. Note that this also
      // removes this transition from the pending list!

      if (s.state === RUNNING) {
        s.state = ENDED;
        s.timer.stop();
        if (s.events.interrupt && typeof s.events.interrupt === 'function') {
          s.events.interrupt();
        }
        delete schedules[sid];
      } else if (+sid < id) {
        s.state = ENDED;
        s.timer.stop();
        delete schedules[sid];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(() => {
      if (transition.state === STARTED) {
        transition.state = RUNNING;
        transition.timer.restart(tick, transition.delay, transition.time);
        tick(elapsed);
      }
    });

    transition.state = STARTING;
    if (transition.events.start && typeof transition.events.start === 'function') {
      transition.events.start();
    }

    if (transition.state !== STARTING) { // interrupted
      return; // eslint-disable-line consistent-return
    }

    transition.state = STARTED;

    // Initialize the tween, deleting null tween.
    let j = -1;

    for (let i = 0; i < n; ++i) {
      const ref = node[transition.ref];
      const res = transition.tweens[i].call(ref);

      if (res) {
        tweens[++j] = res;
      }
    }

    tweens.length = j + 1;
  }

  function tick(elapsed) {
    let t = 1;

    if (elapsed < transition.duration) {
      t = transition.ease.call(null, elapsed / transition.duration);
    } else {
      transition.timer.restart(stop);
      transition.state = ENDING;
    }

    let i = -1;

    while (++i < tweens.length) {
      tweens[i].call(null, t);
    }

    // Dispatch the end event.
    if (transition.state === ENDING) {
      if (transition.events.end && typeof transition.events.end === 'function') {
        transition.events.end();
      }
      stop();
    }
  }

  function stop() {
    transition.state = ENDED;
    transition.timer.stop();
    delete schedules[id];
  }
}