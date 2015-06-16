
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
      //Se registrar los eventos de los botones 
      this.crearFunc = this.game.add.sprite(340, 350,'btnContinuar');
      this.crearFunc.inputEnabled = true;
      this.crearFunc.events.onInputDown.add(this.crearFuncion, this);
      this.crearFunc.visible = false;

      this.run = this.game.add.sprite(500, 350,'btnContinuar');
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCodigo, this);
      this.run.visible = false;

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

      this.txtIns = this.game.add.bitmapText(45 , 310, 'font', '', 18);
      this.txtIns.wordWrap = true;
      this.txtIns.wordWrapWidth = 250;
      this.txtIns.tint = 0xFFFFFF;
      this.instrucciones(this.pasoActual);
  	},

    instrucciones: function(paso){
      switch(paso){//Se define la instruccion a mostrar
        case 0:
          this.txtIns.setText('Hola, por medio del\neditor de codigo\ndebemos ayudar al\npersonaje a cumplir \nuna serie de tareas ');
          break;
        case 1:
          this.txtIns.setText('Para poder ayudarlo\ndebemos conocer sus\npropiedades, las \ncuales permitiran\nsu manipulacion');
          break;
        case 2:
          this.txtIns.setText('Ademas de las \npropiedades, el\npersonaje cuenta con\nuna serie de metodos\nque haran todo\naun mas facil');
          break;
        case 3:
          this.txtIns.setText('Para que hable\nse puede hacer uso\nde dude.mostrar(),\nintentalo');
          this.habilitaEditor(true);
          break;
        case 4:
          this.txtIns.setText('Muy bien, ahora\nveamos que puede\ndecirnos sobre el.\nIntenta con\ndude.mostrar(dude.prop())');
          this.habilitaEditor(true);
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
        case 1:
        case 2:
          this.pasoActual++;
          break;
      }
      this.instrucciones(this.pasoActual);
    },

    crearFuncion: function(){
      
    },

    habilitaEditor: function(estado){
      //Se cambia el estado del editor para su edicion
      this.editor.seleccionado = estado;
      this.run.visible = estado;
    },

    correrCodigo: function(){
      this.editor.hideError();//Se ocultan errores del editor
      this.editor.glow(false);//Se elimina el brillo
      switch(this.pasoActual){//Se valida la accion a tomar respecto al paso actual
        case 3://Paso dude.mostrar()
        case 4://Paso dude.mostrar(dude.prop())
          var correcto = false;
          this.correrLineas();
          if(this.dude.msjBandera == true){//En caso de haber mostrado el msj de prueba correctamente
            if(this.pasoActual == 4){
              if(this.dude.propBandera == true){
                correcto = true;
              }else{
                this.editor.glow(true);
              }
            }else{
              correcto = true;
            }
          }else{
            this.editor.glow(true);
          }
          if(correcto){
            this.editor.seleccionado = false;//Se inhabilita el editor de codigo
            this.pasoActual++;
            this.instrucciones(this.pasoActual);
            this.habilitaEditor(false);
          }
          break;
        default:
          setTimeout(this.correrLineaPasoPaso,750,0,this);
          break;  
      }
      
    },

    correrLineas: function(){
      var i_temp = 0;
      try{
        for(var i=0;i<this.editor.created_lines;i++){
          i_temp = i;
          var instruccion = this.editor.getTextLine(i);
          var F=new Function ("dude",instruccion);
          F(this.dude);
        }
      }catch(err){
        this.editor.showError(err.name,i_temp);
      }
    },

    correrLineaPasoPaso:function(i,e){
      try{
        if(i < e.editor.created_lines){
          var instruccion = e.editor.getTextLine(i);
          var F=new Function ("dude",instruccion);
          F(e.dude);
          e.tablero.setObjCuadro(e.dude.posx, e.dude.posy, '', e.dude);
          i++;
          setTimeout(e.correrLineaPasoPaso,750,i,e);
        }
        e.editor.hideError();
      }catch(err){
        e.editor.showError(err.name,i);        
      }
    }
  };

  module.exports = Nivel6;