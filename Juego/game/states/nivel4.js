 'use strict';
 var Pausa = require('../prefabs/pause');


  function Nivel4() {}
  Nivel5.prototype = {

  	create: function() {
	  this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'Fondo4');
  	},


  };

  module.exports = Nivel4;