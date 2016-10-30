'use strict';

const process = require('process');
const moment  = require('moment');
const colors  = require('colors');
const notifier = require('node-notifier');
const program = require('commander');

const renderFactory = require('./renderFactory');

program
  .usage('<pomodoroLength> <breakLength> [options]')
  .option('-b, --startWithBreak', 'will start counting time from break')
  .option('-a, --ascii', 'remaining time will be displayed via big ascii art font')
  .option('-P, --pomodoroColor <n>', 'timer color when pomodoro is running', 'cyan')
  .option('-B, --breakColor <n>', 'timer color when break is running', 'yellow')
  .option('-T, --task <task>', 'task in progress of this pomodoro - displayed with timer on plain')
  .parse(process.argv);

const REFRESH_RATE = 250; // ms

let WIDTH   = process.stdout.columns;
let HEIGHT  = process.stdout.rows;

process.stdout.on('resize', () => {
  WIDTH = process.stdout.columns;
  HEIGHT = process.stdout.rows;
});

const formatTime = (a,b) => {
  const t = moment(b.diff(a));

  return t.format('mm:ss');
};

const render = renderFactory(program);

const parseArgs = (idx, def) => {
  if (program.args.length <= (idx)) {
    return def;
  }

  return program.args[idx];
};

const State = {
  POMODORO: 'pomodoro',
  BREAK: 'break',
};

// -----------------------------------------------------

const intervalLengths = {
  [State.POMODORO]: Number(parseArgs(0, 25)),
  [State.BREAK]: Number(parseArgs(1, 5))
}

// -----------------------------------------------------

let timerEnd;
let state = program.startWithBreak
  ? State.BREAK
  : State.POMODORO;

const nextState = (currentState) => currentState === State.POMODORO
    ? State.BREAK
    : State.POMODORO;

const messages = {
  [State.POMODORO]: 'end of POMODORO\nstarting BREAK',
  [State.BREAK]: 'end of BREAK\nstarting POMODORO'
};

const buildNotification = message => {
  return {
    title: 'POMOCO',
    message
  };
};

const startPomodoro = () => {
  timerEnd = moment().add(intervalLengths[state], 'm');

  const now = moment();
  setTimeout(() => notifier.notify(buildNotification(messages[state])), timerEnd.diff(now)).unref();
}

startPomodoro();

const timerColours = {
  [State.POMODORO]: program.pomodoroColor,
  [State.BREAK]: program.breakColor 
};

const timer = setInterval(() => {
  const now = moment();

  if (now.isBefore(timerEnd)) {
    render(
        formatTime(now, timerEnd),
        timerColours[state],
        program.task
    );
  } else {
    state = nextState(state);
    startPomodoro();
  }
}, REFRESH_RATE);
