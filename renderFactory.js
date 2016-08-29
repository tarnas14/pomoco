'use strict'

const util    = require('util')
const asciimo = require('asciimo').Figlet
const clear   = require('clear')
const colors = require('colors/safe')

const fancyRender = (time, color) => {
  const FONT = 'Colossal'
  clear()
  asciimo.write(time, FONT, (art) => {
    clear()
    process.stdout.write('\r\n')
    util.puts(color === 'red' ? art.red : art.green)
    asciimo.write(time, FONT, (art) => {})
  })
}

const plainRender = (time, color) => {
  clear()
  console.log(colors[color](time))
}

module.exports = ({plainText}) => plainText ? plainRender : fancyRender
