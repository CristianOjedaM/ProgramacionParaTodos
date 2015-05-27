
  'use strict';
  var Editor = require('../prefabs/editor');
  function Nivel5() {}
  Nivel5.prototype = {

  	create: function() {
	  	//Se incluye el panel de pausa al nivel
      this.editor = new Editor(this.game,20,20,300,400);
      this.game.add.existing(this.editor);
  	}

  };

  module.exports = Nivel5;