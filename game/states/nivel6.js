
  'use strict';
  var Pausa = require('../prefabs/pause');
  var Editor = require('../prefabs/editor');
  var Tablero = require('../prefabs/tablero');

  function Nivel6() {}
  Nivel6.prototype = {

    /*Definicion de propiedades*/
    pasoActual: 0,
    codigoActivo: true,
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

      this.game.add.bitmapText(470, 160, 'font', 'Hola, ha sido un largo\ncamino y ha llegado la\nhora de un reto de\nverdad, en este nivel\ntendras la oportunidad\naprender del uso de\nfunciones por medio de\nla práctica.\nPara completar el nivel\ntendras que escribir\ncodigo Javascript\ny completar cada reto.\n\nEstas listo?!', 24);
    },

    iniciarJuego : function(game){
      var x1 = 531;
      var x2 = 680;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){                 
          this.empezar();        
      }
    }, 

  	empezar: function() {
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel6');
	  	//Se incluye el editor de texto
      this.game.add.sprite(320,25,'fondoEditor');
      this.editor = new Editor(this.game,170,20,400,20);
      this.game.add.existing(this.editor);
      this.editor.seleccionado = false;//Se inhabilita el editor de codigo
      //S incluye el tablero juego
      this.tablero = new Tablero(this.game,20,30,5,5);
      this.game.add.existing(this.tablero);
      //Se agregan los sprotes dentro del tablero de juego
      this.dude = this.tablero.setObjCuadro(0,0,'dude','',15);
      //Se registrar los eventos de los botones 
      this.crearFunc = this.game.add.sprite(340, 350,'btnContinuar');
      this.crearFunc.inputEnabled = true;
      this.crearFunc.events.onInputDown.add(this.crearFuncion, this);
      this.crearFunc.visible = false;

      this.run = this.game.add.sprite(470, 325,'btnEjecutar6');
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCodigo, this);
      this.run.visible = false;

      //Se da inicio al nivel con el las instrucciones de juego
      this.cuadroIns = this.game.add.sprite(this.game.world.centerX,370,'fondoPasos');
      this.cuadroIns.anchor.setTo(0.5,0);

      this.btnContinuar = this.game.add.sprite(this.game.world.centerX, 475,'btnSiguiente6');
      this.btnContinuar.anchor.setTo(0.5,0.5);
      this.btnContinuar.inputEnabled = true;
      this.btnContinuar.events.onInputDown.add(this.pasoSiguiente, this);

      this.txtIns = this.game.add.bitmapText(this.game.world.centerX , 415, 'font', '', 18);
      this.txtIns.anchor.setTo(0.5,0.5);
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
          this.txtIns.setText('Hola, por medio del editor de código debemos\nayudar al personaje a cumplir una\nserie de tareas ');
          break;
        case 1:
          this.txtIns.setText('Para poder ayudarlo debemos conocer sus\npropiedades, las cuales permitirán\nsu manipulación');
          break;
        case 2:
          this.txtIns.setText('Además de las propiedades, el personaje\ncuenta con una serie de métodos que\nharán todo aún mas fácil');
          break;
        case 3:
          this.txtIns.setText('Para que hable se puede hacer uso\nde dude.mostrar(),\ninténtalo');
          this.habilitaEditor(true);
          break;
        case 4:
          this.txtIns.setText('Muy bien, ahora veamos que puede decirnos\nsobre el. Intenta con\ndude.mostrar(dude.prop())\nesto mostrará las propiedades que podemos\nmanipular sobre el personaje');
          this.habilitaEditor(true);
          break;
        case 5:
          this.txtIns.setText('Genial, ahora intenta obtener consejos de\nla siguiente manera.\ndude.mostrar(dude.consejo())');
          this.habilitaEditor(true);
          break;
        case 6:
          this.txtIns.setText('Perfecto, recuerda que puedes hacer uso\nde los consejos en cualquer momento que\ndesees y siempre se mostrarán de forma\naleatoria');
          break;
        case 7:
          this.txtIns.setText('Como ya sabes todo lo que necesitas saber\nsobre el personaje\n\nEmpecemos!');
          break;
        case 8:
          this.txtIns.setText('Recuerdas la propiedad para posición en X\nu horizontal del personaje?\nIntenta cambiar su posicion en X sumando 1\na la posición actual\ndude.posx++');
          this.habilitaEditor(true);
          break;
        case 9:
          this.txtIns.setText('Bien, ahora intenta modificar la posición\nen Y o vertical del personaje');
          this.habilitaEditor(true);
          break;
        case 10:
          this.txtIns.setText('Correcto, recuerda que el personaje tiene\npiernas cortas y solo puede desplazarse\nun cuadro a la vez');
          this.habilitaEditor(false);
          break;
        case 11:
          this.dude.posx = 0;
          this.dude.posy = 0;
          this.tablero.setObjCuadro(0, 0, '', this.dude);
          this.txtIns.setText('Por ello, tu primera misión es encontrar\nla manera de facilitar el movimiento del\npersonaje a lo largo del tablero');
          break;
        case 12:
          this.txtIns.setText('Las funciones son un conjunto de\ninstrucciones para realizar una tarea en\nespecífico. Diseñaremos una que permita mover\nmultiples casillas al personaje');
          break;
        case 13:
          this.txtIns.setText('Para declarar la función empieza escribiendo\nfunction\nseguido por el nombre de la función\nseguido por (), en estos\nparentesis se ubicarán los parametros');
          this.habilitaEditor(true);
          break;
        case 14:
          this.txtIns.setText('Ya que es un conjunto de instrucciones\nes necesario definir cual es su punto de \ninicio; después del parentesis utiliza\nun corchete de apertura para definir\nel inicio');
          break;
        case 15:
          this.txtIns.setText('Deberias tener algo parecido a\nfunction mover(){\nno te alarmes si genera error, aun falta\nmucho por hacer');
          break;
      }
      this.codigoActivo = true;
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
          case 10:
          case 11:
          case 12:
          case 13:
            this.pasoActual++;
            break;
        }
        this.instrucciones(this.pasoActual);
      }else{
        switch(this.pasoActual){
        /*Pasos de instruccion durante codificacion*/
          case 13:
          case 14:
            this.pasoActual++;
            this.instrucciones(this.pasoActual);
            break;
          default:
            this.editor.glow(true);
            break;
        }
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
      if(this.codigoActivo){
        this.codigoActivo = false;
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
            }else{
              this.codigoActivo = true;
            }
            break;
          /*Pasos movimiento de personaje*/
          case 8://Paso dude.posx++
          case 9://Paso dude.posy++
            setTimeout(this.correrLineaPasoPaso,750,0,this,this.pasoActual);
            break;
          default:
            setTimeout(this.correrLineaPasoPaso,750,0,this);
            break;
        }
      }
    },

    codCorrecto: function(){
      this.editor.seleccionado = false;//Se inhabilita el editor de codigo
      this.pasoActual++;
      this.instrucciones(this.pasoActual);
      this.habilitaEditor(false);
    },

    validaciones: function(){
      var difX = Math.abs(this.dude.posx - this.dude.propiedades[0].val);
      var difY = Math.abs(this.dude.posy - this.dude.propiedades[0].val);
      
      if(difX > 1 || difY > 1){//Se valida intento de desplazamiento de mas de una casilla
        this.dude.mostrar("No puedo moverme por tantas casillas al tiempo :(");
        this.dude.posx = this.dude.propiedades[0].val;//Valor temporal de la propiedad posx
        this.dude.posy = this.dude.propiedades[1].val;//Valor temporal de la propiedad posy
        return false;
      }else if(this.dude.posx < 0 || this.dude.posx > 4){//Se valida limites de tablero en X
        this.dude.mostrar("No puedo desplazarme afuera del tablero :(");
        this.dude.posx = this.dude.propiedades[0].val;//Valor temporal de la propiedad posx
        return false;
      }else if(this.dude.posy < 0 || this.dude.posy > 4){//Se valida limites de tablero en Y
        this.dude.mostrar("No puedo desplazarme afuera del tablero :(");
        this.dude.posy = this.dude.propiedades[1].val;//Valor temporal de la propiedad posy
        return false;
      }else{
        return true;
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
        this.codigoActivo = true;
      }
    },

    correrLineaPasoPaso:function(i,e,paso){
      try{
        if(i < e.editor.created_lines){
          var instruccion = e.editor.getTextLine(i);
          var F=new Function ("dude",instruccion);
          F(e.dude);
          if(e.validaciones() == true){
            e.tablero.setObjCuadro(e.dude.posx, e.dude.posy, '', e.dude);
            if(paso){//En caso de requerir validaciones especiales debido al paso actual
              if(paso == 8){//Paso movimiento inicial en X
                if(e.dude.xBandera == true){//Se comprueba que se haya realizado el movimiento en X
                  e.codCorrecto();
                }else{
                  e.codigoActivo = true;
                  e.editor.glow(true);
                }
              }else if(paso == 9){//Paso movimiento inicial en Y
                if(e.dude.yBandera == true){//Se comprueba que se haya realizado el movimiento en Y
                  e.codCorrecto();
                }else{
                  e.codigoActivo = true;
                  e.editor.glow(true);
                }
              }
            }
          }else{
            e.codigoActivo = true;
          }
          i++;
          setTimeout(e.correrLineaPasoPaso,750,i,e);
        }
        e.editor.hideError();
      }catch(err){
        e.editor.showError(err.name,i);    
        e.codigoActivo = true;    
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