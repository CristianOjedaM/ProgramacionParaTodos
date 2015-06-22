
  'use strict';
  var Editor = require('../prefabs/editor');
  var Tablero = require('../prefabs/tablero');

  function Nivel6() {}
  Nivel6.prototype = {

    /*Definicion de propiedades*/
    pasoActual: 0,
    flagpause: false,
    init:function(){
      this.pasoActual = 0; 
      this.flagpause= false;     
    },

    create: function() {
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN6');
      this.game.input.onDown.add(this.iniciarJuego,this);
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){                 
          this.empezar();        
      }
    }, 

  	empezar: function() {
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

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

       //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
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
          this.txtIns.setText('Muy bien, ahora\nveamos que puede\ndecirnos sobre el.\nIntenta con\ndude.mostrar(dude.prop())\nesto mostrara las\npropiedades que podemos\nmanipular sobre el\npersonaje');
          this.habilitaEditor(true);
          break;
        case 5:
          this.txtIns.setText('Genial, ahora intenta\nobtener consejos de la\nsiguiente manera.\ndude.mostrar(dude.consejo())');
          this.habilitaEditor(true);
          break;
        case 6:
          this.txtIns.setText('Perfecto, recuerda que\npuedes hacer uso de\nlos consejos en cualquer\nmomento que desees\ny siempre se mostraran\nde forma aleatoria');
          break;
        case 7:
          this.txtIns.setText('Como ya sabes todo lo\nque necesitas saber\nsobre el personaje\n\nEmpecemos!');
          break;
        case 8:
          this.txtIns.setText('Recuerdas la propiedad para\nposicion en X u horizontal\ndel personaje?\n\nIntenta cambiar su posicion\nen X sumandole 1 a la posicion\nactual\n\ndude.posx++');
          this.habilitaEditor(true);
          break;
        case 9:
          this.txtIns.setText('Bien, ahora intenta modificar\nla posicion en Y o vertical\ndel personaje\n');
          this.habilitaEditor(true);
          break;
        case 10:
          break;
      }
    },

    pasoSiguiente: function(){
      if(!this.editor.seleccionado){
        switch(this.pasoActual){
          /*Pasos de texto (Tan solo generan siguiente)*/
          case 0:
          case 1:
          case 2:
          case 6:
          case 7:
            this.pasoActual++;
            break;
        }
        this.instrucciones(this.pasoActual);
      }else{
        this.editor.glow(true);
      }
    },

    crearFuncion: function(){
      
    },

    habilitaEditor: function(estado){
      //Se cambia el estado del editor para su edicion
      this.editor.seleccionado = estado;
      this.run.visible = estado;
      if(estado == true){
        this.editor.limpiar();
      }
    },

    correrCodigo: function(){
      this.editor.hideError();//Se ocultan errores del editor
      this.editor.glow(false);//Se elimina el brillo
      switch(this.pasoActual){//Se valida la accion a tomar respecto al paso actual
        /*Pasos introductorios*/
        case 3://Paso dude.mostrar()
        case 4://Paso dude.mostrar(dude.prop())
        case 5://Paso dude.mostrar(dude.consejo())
          var correcto = false;
          this.correrLineas();
          if(this.dude.msjBandera == true){//En caso de haber mostrado el msj de prueba correctamente
            if(this.pasoActual == 4){
              if(this.dude.propBandera == true){
                correcto = true;
              }else{
                this.editor.glow(true);
              }
            }else if(this.pasoActual == 5){
              if(this.dude.consBandera == true){
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
            this.codCorrecto();
          }
          break;
        /*Pasos movimiento de personaje*/
        case 8:
        case 9:
          setTimeout(this.correrLineaPasoPaso,750,0,this);
          if(this.pasoActual == 8){
            if(this.dude.xBandera == true){//Se comprueba que se haya realizado el movimiento en X
              this.codCorrecto();
            }else{
              this.editor.glow(true);
            }
          }else{
            if(this.dude.yBandera == true){//Se comprueba que se haya realizado el movimiento en Y
              this.codCorrecto();
            }else{
              this.editor.glow(true);
            }
          }
          break;
        default:
          setTimeout(this.correrLineaPasoPaso,750,0,this);
          break;  
      }      
    },

    codCorrecto: function(){
      this.editor.seleccionado = false;//Se inhabilita el editor de codigo
      this.pasoActual++;
      this.instrucciones(this.pasoActual);
      this.habilitaEditor(false);
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
    },
    pausaJuego: function(game){
      var x1 = (this.game.width - 81);
      var x2 = (this.game.width - 36);
      var y1 = 10;
      var y2 = 55;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.game.paused == false){
          //Se muestra panel de pausa
          if(this.flagpause==false){
            this.pnlPausa.show();   
            this.flagpause = true;
          }
            
        }else{
          //Se esconde el panel de pausa
          this.game.paused = false;
          this.pnlPausa.hide();
          this.flagpause = false;          
        }
      }
    },
  };

  module.exports = Nivel6;