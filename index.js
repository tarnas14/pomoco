'use strict';

const process = require('process');
const asciimo = require('asciimo');
const moment  = require('moment');
const clear   = require('clear');

const REFRESH_RATE = 250; // ms

let WIDTH   = process.stdout.columns;
let HEIGHT  = process.stdout.rows;

process.stdout.on('resize', () => {
  WIDTH = process.stdout.columns;
  HEIGHT = process.stdout.rows;
});

let POMODORO  = 0.1; // m
let BREAK     = 0.1; // m

let pend = moment().add(POMODORO, 'm');
let bend = moment().add(POMODORO + BREAK, 'm');

const formatTime = (a,b) => {
  const t = moment(b.diff(a));

  return t.format('mm:ss');
};

const timer = setInterval(() => {
  const now = moment();

  if (now.isBefore(pend)) {
    console.log('P', formatTime(now, pend));
  } else if(now.isBefore(bend)) {
    console.log('B', formatTime(now, bend));
  } else {
    clearInterval(timer);
    console.log('See ya!');
  }

}, REFRESH_RATE);
