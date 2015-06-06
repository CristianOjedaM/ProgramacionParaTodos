
  'use strict';
  var Editor = require('../prefabs/editor');
  var Tablero = require('../prefabs/tablero');

  function Nivel6() {}
  Nivel6.prototype = {

  	create: function() {
	  	//Se incluye el panel de pausa al nivel
      this.editor = new Editor(this.game,170,20,400,20);
      this.game.add.existing(this.editor);

      this.tablero = new Tablero(this.game,20,20,5,5);
      this.game.add.existing(this.tablero);

      this.dude = this.tablero.setObjCuadro(0,0,'dude');
      this.dude.posx = 0;
      this.dude.posy = 0;


      this.crearFunc = this.game.add.sprite(340, 350,'btnContinuar');
      this.crearFunc.inputEnabled = true;
      this.crearFunc.events.onInputDown.add(this.crearFuncion, this);

      this.run = this.game.add.sprite(500, 350,'btnContinuar');
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCodigo, this);
  	},

    crearFuncion: function(){
      
    },

    correrCodigo: function(){
      /*for(var i=0;i<this.editor.created_lines;i++){
        var instruccion = this.editor.getTextLine(i);
        var F=new Function ("dude",instruccion);
        F(this.dude);
        this.tablero.setObjCuadro(this.dude.posx, this.dude.posy, '', this.dude);
      }*/
      
      setTimeout(this.correrLinea,750,0,this);
      

      /*var theInstructions = this.editor.getText();
      var F=new Function ("dude",theInstructions);
      F(this.dude);
      console.log("- "+this.dude.posy);
      this.tablero.setObjCuadro(this.dude.posx, this.dude.posy, '', this.dude);
      //eval(this.editor.getText());*/
    },

    correrLinea:function(i,e){
      if(i < e.editor.created_lines){
        var instruccion = e.editor.getTextLine(i);        
        var F=new Function ("dude",instruccion);        
        F(e.dude);        
        e.tablero.setObjCuadro(e.dude.posx, e.dude.posy, '', e.dude);
        i++;
        setTimeout(e.correrLinea,750,i,e);
      }
    }

  };

  module.exports = Nivel6;