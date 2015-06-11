
  'use strict';
  var Editor = require('../prefabs/editor');
  var Tablero = require('../prefabs/tablero');

  function Nivel6() {}
  Nivel6.prototype = {

    /*Definicion de propiedades*/
    pasoActual: 0,

  	create: function() {
	  	//Se incluye el editor de texto
      this.editor = new Editor(this.game,170,20,400,20);
      this.game.add.existing(this.editor);
      this.editor.seleccionado = false;//Se inhabilita el editor de codigo
      //S incluye el tablero juego
      this.tablero = new Tablero(this.game,20,20,5,5);
      this.game.add.existing(this.tablero);
      //Se agregan los sprotes dentro del tablero de juego
      this.dude = this.tablero.setObjCuadro(0,0,'dude');
      this.dude.posx = 0;
      this.dude.posy = 0;
      //Se registrar los eventos de los botones 
      this.crearFunc = this.game.add.sprite(340, 350,'btnContinuar');
      this.crearFunc.inputEnabled = true;
      this.crearFunc.events.onInputDown.add(this.crearFuncion, this);
      this.run = this.game.add.sprite(500, 350,'btnContinuar');
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCodigo, this);

      this.btnContinuar = this.game.add.sprite(165, 520,'btnContinuar');
      this.btnContinuar.anchor.setTo(0.5,0.5);
      this.btnContinuar.inputEnabled = true;
      this.btnContinuar.events.onInputDown.add(this.pasoSiguiente, this);

      //Se da inicio al nivel con el las instrucciones de juego
      this.cuadroIns = this.game.add.graphics( 0, 0 );
      this.cuadroIns.beginFill(0x272822, 1);
      this.cuadroIns.lineStyle(2, 0xffffff);
      this.cuadroIns.bounds = new PIXI.Rectangle(40, 300, 250, 200);
      this.cuadroIns.drawRect(40, 300, 250, 200);

      this.txtIns = this.game.add.bitmapText(50 , 310, 'font', '', 24);
      this.txtIns.wordWrap = true;
      this.txtIns.wordWrapWidth = 250;
      this.txtIns.tint = 0xFFFFFF;
      this.instrucciones(this.pasoActual);
  	},

    instrucciones: function(paso){
      switch(paso){//Se define la instruccion a mostrar
        case 0:
          this.txtIns.setText('Hola, por medio del\neditor de código\ndebemos ayudar al\npersonaje a cumplir \nuna serie de tareas ');
          break;
        case 1:
          this.txtIns.setText('mmm');
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          break;
        case 8:
          break;
        case 9:
          break;
        case 10:
          break;
      }
    },

    pasoSiguiente: function(){
      switch(this.pasoActual){
        case 0:
          this.pasoActual++;
          break;
      }
      this.instrucciones(this.pasoActual);
    },

    crearFuncion: function(){
      
    },

    correrCodigo: function(){
      setTimeout(this.correrLinea,750,0,this);
    },

    correrLinea:function(i,e){
      try {
        if(i < e.editor.created_lines){
          var instruccion = e.editor.getTextLine(i);        
          var F=new Function ("dude",instruccion);        
          F(e.dude);        
          e.tablero.setObjCuadro(e.dude.posx, e.dude.posy, '', e.dude);
          i++;
          setTimeout(e.correrLinea,750,i,e);
        }
        e.editor.hideError();
      }catch(err) {
        e.editor.showError(err.name,i);        
      }
    }
  };

  module.exports = Nivel6;