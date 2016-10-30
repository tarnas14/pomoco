'use strict'

const util    = require('util')
const asciimo = require('asciimo').Figlet
const clear   = require('clear')
const colors = require('colors/safe')

const message = (time, task) => `${time}${task.length ? ` - ${task}`: ''}`;

const fancyRender = (time, color) => {
  const FONT = 'Colossal'
  clear()
  asciimo.write(time, FONT, (art) => {
    clear()
    process.stdout.write('\r\n')
    util.puts(art[color])
    asciimo.write(time, FONT, (art) => {})
  })
}

const plainRender = (time, color, task = '') => {
  clear()
  console.log(colors[color](message(time, task)))
}

module.exports = ({ascii}) => ascii ? fancyRender : plainRender
