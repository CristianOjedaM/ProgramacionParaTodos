'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'programacionparatodos');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('nivel1', require('./states/nivel1'));
  game.state.add('nivel1_1', require('./states/nivel1_1'));
  game.state.add('nivel2', require('./states/nivel2'));
  game.state.add('nivel3', require('./states/nivel3'));
  game.state.add('nivel4', require('./states/nivel4'));
  game.state.add('nivel5', require('./states/nivel5'));
  game.state.add('nivel6', require('./states/nivel6'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};