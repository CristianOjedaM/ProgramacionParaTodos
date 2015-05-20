
  'use strict';
  var Pausa = require('../prefabs/pause');

  function Nivel1() {}
  Nivel1.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 60,
    pausa: false,

    create: function() {
      //Habilitacion de fisicas
      this.physics = this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.world.setBounds(0, 0, 800, 1920);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.loop(5000, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel1');

      //Se definen los audios del nivel
      this.jump_sound = this.game.add.audio('jump_sound');

      //Grupo de plataformas
      this.plataformas = this.game.add.group();

      //Plataformas son afectadas por fisicas
      this.plataformas.enableBody = true;

      var nPisos = (1920/150);//Se determina el numero de plataformas con base el alto total y la diferencia entre una y otra
      for (var i = 0; i < nPisos; i++){
        var ancho = Math.floor((Math.random() * 250) + 100);//Se determina ancho aleatorio para cada plataforma
        var posX = Math.floor((Math.random() * (this.game.width-ancho)));//Se determina posicion X aleatoria
          var plataforma = this.game.add.tileSprite(posX, (i * 150), ancho, 32, 'plataforma');
          if(i%2 != 0){
            plataforma.desplazamiento = 1;
          }else{
            plataforma.desplazamiento = 2;
          }
          this.plataformas.add(plataforma);
          plataforma.body.immovable = true;
      }

      //Creacion del piso
      var ground = this.game.add.tileSprite(0, this.game.world.height - 40, 800, 40, 'piso');
      this.plataformas.add(ground);
      //Piso objeto de colision
      ground.body.immovable = true;
      ground.desplazamiento = 0;

      //Se realiza creacion del jugador
      this.jugador = this.game.add.sprite(32, this.game.world.height - 750, 'personaje');
      //Habilitacion de fisicas sobre el jugador
      this.game.physics.arcade.enable(this.jugador);
      //Propiedades fisicas del jugador (Se agrega un pequeño rebote)
      this.jugador.body.bounce.y = 0.2;
      this.jugador.body.gravity.y = 550;
      this.jugador.body.collideWorldBounds = true;

      //Se definen las animaciones del jugador
      this.jugador.animations.add('left', [14,13,12,11,10,9,8,7], 15, true);
      this.jugador.animations.add('right', [16,17,18,19,20,21,22,23], 15, true);

      this.jugador.animations.add('jump', [31,32,33,34,35,36,37,38,39], 15, true);
      this.jugador.animations.add('jump_left', [6,5,4,3,2,1,0], 15, true);
      this.jugador.animations.add('jump_right', [24,25,26,27,28,29,30], 15, true);

      this.jugador.esSalto = false;

      //Creacion del grupo de items
      this.items = this.game.add.group();
      //Habilitacion de colisiones 
      this.items.enableBody = true;

      //Control de score
      this.cuadroScore = this.game.add.sprite((this.game.width - 130),(this.game.height - 200),'score');
      this.cuadroScore.fixedToCamera = true;
      this.scoreText[0] = this.game.add.text(this.cuadroScore.x + 90 , this.cuadroScore.y + 28, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[0].fixedToCamera = true;
      this.scoreText[1] = this.game.add.text(this.cuadroScore.x + 90 , this.cuadroScore.y + 68, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[1].fixedToCamera = true;
      this.scoreText[2] = this.game.add.text(this.cuadroScore.x + 90 , this.cuadroScore.y + 106, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[2].fixedToCamera = true;
      this.scoreText[3] = this.game.add.text(this.cuadroScore.x + 90 , this.cuadroScore.y + 145, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[3].fixedToCamera = true;
      
      //Se setea el texto para el cronometro
      this.timer = this.game.add.text(((this.game.width)/2), 16 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });
      this.timer.fixedToCamera = true; 

      this.cursors = this.game.input.keyboard.createCursorKeys();

      //Seguimiento de camara
      this.game.camera.follow(this.jugador);

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa', this.pausaJuego, this);
      this.btnPausa.fixedToCamera = true;

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego(),this);
    },

    update: function() {
      this.game.physics.arcade.collide(this.jugador, this.plataformas);
      this.game.physics.arcade.collide(this.items, this.plataformas);

      //Se define el metodo de colision entre jugador y estrellas
      this.game.physics.arcade.overlap(this.jugador, this.items, this.recogerItem, null, this);

      this.jugador.body.velocity.x = 0;//Reseteo de velocidad horizontal si no se presentan acciones sobre el jugador

      if (this.cursors.left.isDown){//Movimiento a la izquierda
        this.jugador.body.velocity.x = -150;
        if(this.jugador.esSalto){//En caso de encontrarse en el aire
          this.jugador.animations.play('jump_left');//Se muestra animacion de salto
        }else{
          this.jugador.animations.play('left');//Se muestra animacion de caminado
        }
      }else if (this.cursors.right.isDown){//Movimiento a la derecha
        this.jugador.body.velocity.x = 150;
        if(this.jugador.esSalto){//En caso de encontrarse en el aire
          this.jugador.animations.play('jump_right');//Se muestra animacion de salto
        }else{
          this.jugador.animations.play('right');//Se muestra animacino de caminado
        }
      }else{//Idle
        if(this.jugador.esSalto){//En caso de encontrarse en el aire
          this.jugador.animations.play('jump');//Se muestra animacion de salto
        }else{
          this.jugador.animations.stop();
          this.jugador.frame = 15;
        }
      }
      
      if(this.jugador.body.touching.down){//En caso de tocar suelo
        this.jugador.esSalto = false;
      }

      //Habilitar salto si el jugador toca alguna plataforma
      if (this.cursors.up.isDown && this.jugador.body.touching.down){
        this.jugador.esSalto = true;
        this.jugador.body.velocity.y = -450;
        this.jump_sound.play();
      }

      //Acciones de movimiento para las plataformas de juego
      this.plataformas.forEach(function(plat) {
        if(plat.desplazamiento == 1){//En caso de ser tipo 1, el desplazamiento sera hacia la derecha
          if(plat.body.x > this.game.width){
            plat.body.x = (0 - plat.body.width);
          }
          plat.body.velocity.x = 250;
        }else if(plat.desplazamiento == 2){//En caso de ser tipo 2, el desplazamiento sera hacia la izquierda
          if((plat.body.x + plat.body.width) < 0){
            plat.body.x = this.game.width;
          }
          plat.body.velocity.x = -150;
        }
      }, this);
    },

    crearItem: function(){
      for (var i = 0; i < 5; i++){
        var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 3
        var xItem = Math.floor(Math.random() * (this.game.width - 32)) + 32;
        var yItem = Math.floor(Math.random() * (this.game.world.bounds.height - 150)) + 50;
        var item = this.items.create(xItem, yItem, 'item', tipo);
        item.tipo = tipo;
        //item.body.gravity.y = 300;//Se agrega gravedad al objeto
        //item.body.bounce.y = 0.7 + Math.random() * 0.2;//Se agrega rebote al objeto
      }
    },

    recogerItem: function (jugador, item) {
        switch(item.tipo){
          case 0://Tipo cadena
            this.score.tipoCadena += 1;
            this.scoreText[0].text = this.score.tipoCadena;
            break;
          case 1://Tipo numero
            this.score.tipoNumero += 1;
            this.scoreText[1].text = this.score.tipoNumero;
            break;
          case 2://Tipo booleano
            this.score.tipoBool += 1;
            this.scoreText[2].text = this.score.tipoBool;
            break;
          case 3://Tipo array
            this.score.tipoArray += 1;
            this.scoreText[3].text = this.score.tipoArray;
            break;
        }
        item.kill();
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);
        this.siguiente.fixedToCamera = true; 

        //Detener metodo de update
        this.tiempo.stop();
        //Eliminar items restantes en el campo
        this.items.forEach(function(item) {
            item.kill();
        });
        this.btnPausa.kill();
      }

      var minutos = 0;
      var segundos = 0;
        
      if(this.maxtime/60 > 0){
        minutos = Math.floor(this.maxtime/60);
        segundos = this.maxtime%60;
      }else{
        minutos = 0;
        segundos = this.maxtime; 
      }
      
      this.maxtime--;
        
      //Se agrega cero a la izquierda en caso de ser de un solo digito   
      if (segundos < 10)
        segundos = '0' + segundos;
   
      if (minutos < 10)
        minutos = '0' + minutos;
   
      this.timer.setText(minutos + ':' +segundos);
    },

    clickListener: function() {
      //Se da paso al seiguiente nivel de juego (Segunda parte del nivel 1)
      this.game.state.start('nivel1_1',true,false,this.score);
    },

    pausaJuego: function(){
      if(this.pausa == false){
        //Se muestra panel de pausa
        this.pnlPausa.show();
        this.pausa = true;      
      }else{
        //Se esconde el panel de pausa
        this.game.paused = false;
        this.pnlPausa.hide();
        this.pausa = false;
      }
    }
  };
  
  module.exports = Nivel1;