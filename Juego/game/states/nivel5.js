
  'use strict';
  var Pausa = require('../prefabs/pause');

  var Situacion = 
    [{
      "tipo"  : 'for',
      "ciclo": [{'texto':'var i = 0; i >= []; i++','respuesta':true},{'texto':'var i = 0; i >= []; i--','respuesta':false},{'texto':'var i = []; i <= 0; i--','respuesta':false}],
      "acciones" :  [{'texto':'cruzar();','respuesta': true},{'texto':'saltar();','respuesta':false},{'texto':'esperar();','respuesta':false},{'texto':'hablar();','respuesta':false},{'texto':'disparar();','respuesta':false}]
    },
    {
      "tipo"  : 'while',
      "ciclo": [{'texto':'obstaculo.distancia != 50','respuesta':false},{'texto':'obstaculo.distancia <= 50','respuesta':true},{'texto':'obstaculo.distancia == 51','respuesta':false}],
      "acciones" :  [{'texto':'saltar();','respuesta':'slot1'},{'texto':'esperar();','respuesta':'invalida'},{'texto':'correr();','respuesta':'slot2'},{'texto':'nadar();','respuesta':'invalida'},{'texto':'arrastrar();','respuesta':'invalida'}]
    }];


  function Nivel5() {}
  Nivel5.prototype = {
    flagpause:false,
    intro:true,
    intSituacion:0,
    init:function(){
      this.flagpause=false;
      this.intro=true;
    },

  	create: function() {
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN3');
      this.game.input.onDown.add(this.iniciarJuego,this);
  	},

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.intro){          
          this.empezar();
        }
      }
    }, 

    empezar:function () {
       //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);      
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel4');

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;

      //Se crea marco de la situacion
      this.game.add.sprite(10,40,'fondosituacion');

      //Se agrega boton de ejecucion
      this.run = this.game.add.sprite(230, 355,'btnEjecutar4');
      this.run.anchor.setTo(0.5,0.5);
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCondicion, this);

      //boton ciclo while
      this.btnwhile = this.game.add.sprite(546, 100,'btnwhile');
      this.btnwhile.inputEnabled = true;
      this.btnwhile.events.onInputDown.add(this.listenerwhile, this);

      //boton ciclo for
      this.btnfor = this.game.add.sprite(546, 222,'btnfor');
      this.btnfor.inputEnabled = true;
      this.btnfor.events.onInputDown.add(this.listenerfor, this);

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

       //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
      //Se indica que sale del intro
      this.intro = false;
    },

    update:function(){
      if(!this.intro){

      }
    },

    crearSituacion:function(){
      //Se crea slot de estructura if
      this.slot = this.items.create(470,40,'slotIF');
      //creamos las acciones de la situación
      var yitem = 350;
      var CItems = this.items;
      var game = this;

      Situacion[this.intSituacion].acciones.forEach(function(acciontext) {
          var item = CItems.create(535,yitem,'accion_small');
          item.tipo = 0;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,acciontext.texto , { font: '14px calibri', fill: '#fff', align:'center'});
          item.respuesta = acciontext.respuesta;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 350;
      Situacion[this.intSituacion].ciclo.forEach(function(condiciontext) {
          var item = CItems.create(690,yitem,'condicion');          
          item.tipo = 1;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.text(item.x, item.y,condiciontext.texto , { font: '14px calibri', fill: '#fff', align:'center'});
          item.respuesta = condiciontext.respuesta;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });
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
    correrCondicion: function(){

    },
    listenerwhile:function(){
      if(Situacion[intSituacion].tipo == 'while'){
        this.crearSituacion();
      }else{
        alert('este no es el mejor ciclo recuerda que bla bla bla');
      }
    },
    listenerfor:function(){
      if(Situacion[intSituacion].tipo == 'for'){
        this.crearSituacion();
      }else{
        alert('este no es el mejor ciclo recuerda que bla bla bla');
      }
    },


  };

  module.exports = Nivel5;