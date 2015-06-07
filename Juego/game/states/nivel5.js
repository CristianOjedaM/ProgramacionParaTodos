
  'use strict';
  var Editor = require('../prefabs/editor');
  var Tablero = require('../prefabs/tablero');

  function Nivel5() {}
  Nivel5.prototype = {

  	create: function() {
	  	//Se incluye el panel de pausa al nivel
      this.editor = new Editor(this.game,170,20,400,20);
      this.game.add.existing(this.editor);
  	},


  };

  module.exports = Nivel5;