(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'programacionparatodos');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('nivel1', require('./states/nivel1'));
  game.state.add('nivel1_1', require('./states/nivel1_1'));
  game.state.add('nivel2', require('./states/nivel2'));
  game.state.add('nivel3', require('./states/nivel3'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/nivel1":7,"./states/nivel1_1":8,"./states/nivel2":9,"./states/nivel3":10,"./states/play":11,"./states/preload":12}],2:[function(require,module,exports){

  'use strict';

  // Create our pause panel extending Phaser.Group
  var Pause = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se agrega el panel
    this.panel = this.create(this.game.width/2, 10, 'fondoPausa');
    this.panel.fixedToCamera = true;
    this.panel.anchor.setTo(0.5, 0);

    //this.game.onPause.add(enPausa, this);

    // Add text
    this.pauseText = this.game.add.text(100, 20, 'Juego pausado', { font: '24px calibri', fill: '#000', align:'center'});
    this.pauseText.fixedToCamera = true;
    //this.pauseText = this.game.add.bitmapText(100, 20, 'kenpixelblocks', 'Game paused', 24);
    this.add(this.pauseText);

    //Boton de play o resume
    this.btnPlay = this.game.add.button((this.game.width - 81), 10, 'btnPausa', function(){
      this.game.state.getCurrentState().pausaJuego();}//Se invoca metodo pausaJuego de cada nivel
    , this);
    this.btnPlay.fixedToCamera = true;
    this.btnPlay.frame = 1;
    this.add(this.btnPlay);

    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -100;
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true; enPausa(game_);}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-100}, 200, Phaser.Easing.Linear.NONE, true);
  };

  function enPausa(game){
    if(game.paused){
      setTimeout(enPausa,50,game);    
    }
  }  

  module.exports = Pause;
},{}],3:[function(require,module,exports){
'use strict';

var TextBox = function(game, x, y, width, heigth, defaultTxt) {
  Phaser.Sprite.call(this, game, x, y, '', 0);

  /*Definicion de propiedades*/
  this.seleccionado = true;
  this.shift = false;
  this.length = 20;
  //Se dibuja la caja de texto
  this.cajaTexto = game.add.graphics( 0, 0 );
  this.cajaTexto.beginFill(0xFFFFFF, 1);
  this.cajaTexto.bounds = new PIXI.Rectangle(x, y, width, heigth);
  this.cajaTexto.drawRect(x, y, width, heigth);
  //Se define el texto
  this.texto = game.add.text(x , y, defaultTxt, { font: '24px calibri', fill: '#000', align:'center'});
  this.textData = "";
  
  // initialize your prefab here
  //this.inputEnabled = true;
  game.input.keyboard.addCallbacks(this, this.keyPress, this.keyUp, null);
  //this.events.onInputDown.add(this.seleccionar, this);
};

TextBox.prototype = Object.create(Phaser.Sprite.prototype);
TextBox.prototype.constructor = TextBox;

TextBox.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

TextBox.prototype.seleccionar = function() {
	this.seleccionado = true;
};

TextBox.prototype.keyPress = function(data) {
    if(this.seleccionado) {
      var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
      console.log(charCode);
      switch(data.keyCode) {
        case 8://En caso de ser la tecla borrar
          this.textData = this.textData.substring(0, this.textData.length - 1);
          this.texto.text = this.textData;
          break;
        case 16://En caso de ser la tecla shift
          this.shift = true;
          break;
        case 50://En caso de ser la tecla numero 2
          if(this.shift){
            this.textData += "\"";
            this.texto.text = this.textData;
          }else{
            this.textData += "2";
            this.texto.text = this.textData;
          }
          break;
        case 191://Tecla para cierre de corchetes
          if(this.shift){
            this.textData += "]";
            this.texto.text = this.textData;
          }else{
            this.textData += "}";
            this.texto.text = this.textData;
          }
          break;
        case 222://Tecla para apretura corchetes
          if(this.shift){
            this.textData += "[";
            this.texto.text = this.textData;
          }else{
            this.textData += "{";
            this.texto.text = this.textData;
          }
          break;
        default:
          if ((this.textData.length + 1) <= this.length) {
            var letra = String.fromCharCode((96 <= charCode && charCode <= 105)? charCode-48 : charCode).toLowerCase();
            if (letra.length > 0) {
              this.textData += letra;
              this.texto.text = this.textData;
            }
          }
          break;
      }
    }
};

TextBox.prototype.keyUp = function(data) {
  if(this.seleccionado){
    var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
    console.log(charCode);
    switch(data.keyCode) {
      case 16://En caso de ser la tecla shift
        this.shift = false;
        break;
    }
  }
};

TextBox.prototype.destruir = function() {
  this.cajaTexto.destroy();
  this.texto.destroy();
  this.seleccionado = false;
  this.destroy();
};

module.exports = TextBox;

},{}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '45px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Programación para todos', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){

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
},{"../prefabs/pause":2}],8:[function(require,module,exports){

  'use strict';
  var Pausa = require('../prefabs/pause');

  function Nivel1_1() {}
  Nivel1_1.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 10,
    prev_score: {},
    prev_score_base: {},
    error_score: {errorCadena:0,errorNumero:0,errorBool:0,errorArray:0,errorGeneral:0},
    itemsCompletos: 0,
    vel:50,//Velocidad de inicio para movimiento de items
    itemSelec: false,
    pausa: false,    

    //Definicion temporal de datos para mostrar por tipo de dato
    stringItems: new Array('"a"','"b"','"c"','"Hola mundo"','"Alberto"','"9548"','""'),
    numberItems: new Array('1','2','987987123'),
    booleanItems: new Array('false','true'),
    arrayItems: new Array('[]','[0]','["a","b","c"]','[9,8,7,25,1]','[{},{a:"1",b:true},{c:1,d:"abc"}]'),

    init: function(score){//Funcion para recibir los argumentos de score (base del nivel)
      //Asignacion de scores previos
      this.prev_score = score;
      this.prev_score_base = score;
    },

    create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      //this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.loop_creaItem = this.tiempo.loop(1500, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel1');

      //Tubos de tipos de dato
      this.tubos = this.game.add.group();
      this.tubos.enableBody = true;
      for(var i = 0;i < 4; i++){
        var tubo = this.tubos.create((this.game.width - 185), ((i*150)+30), 'tubo',i);
        tubo.tipo = i;
      }      

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;

      //Control de score
      this.cuadroScore = this.game.add.sprite((this.game.width - 130),(this.game.height - 200),'score');
      this.scoreText[0] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 35, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[1] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 72, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[2] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 108, '0', { font: '24px calibri', fill: '#000', align:'center'});
      this.scoreText[3] = this.game.add.text(this.cuadroScore.x + 100 , this.cuadroScore.y + 141, '0', { font: '24px calibri', fill: '#000', align:'center'});
    
      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa', this.pausaJuego, this);
      this.btnPausa.fixedToCamera = true;

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa); 
      this.game.input.onDown.add(this.enPausa,this);      

    },

    update: function() {
      //Se obtienen las posiciones del cursor en el juego
      var mouseX = this.game.input.x;
      var mouseY = this.game.input.y;
      var tempError_score = this.error_score;
      this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){
          item.body.velocity.y = 0;//Se retira el movimiento vertical
          item.body.x = mouseX
          item.body.y = mouseY;
        }

        //Se verifica que los items no hayan superado los limites del escenario
        if((item.body.y+item.body.height) < 0){
          tempError_score.errorGeneral ++;
          item.kill();
        }
      });   
      this.error_score = tempError_score;
      //Se realiza el movimiento del texto en conjunto con el item
      if(this.itemSelec == true){
        this.textoItem.x =  mouseX;
        this.textoItem.y =  mouseY - 35;
      }

      //Se realiza la verificación de que se han creado todos los items de nivel
      if(this.itemsCompletos == 4){
        //this.tiempo.events.remove(this.loop_creaItem);//Se retira el evento de creacion de items
        
        this.siguiente = this.game.add.sprite(this.game.width/2 - 75, this.game.height/2 - 25,'btnContinuar');
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);

        this.itemsCompletos = -1;
      }
    },

    crearItem: function(){
      var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 3
      var usados = new Array();
      var xItem = Math.floor(Math.random() * (this.game.width/3)) + 32;
      var yItem = (this.game.height);
      var continuar = false;
      this.vel += 5; 
      switch(tipo){
        case 0://En caso de ser tipo 0 se genera un item de cadena (Si existen aun)
          if(this.prev_score.tipoCadena > 0){
            this.prev_score.tipoCadena -= 1;
            continuar = true;
          }else if(this.prev_score.tipoCadena == 0){
            this.itemsCompletos++;
            this.prev_score.tipoCadena = -1;
          }
          break;
        case 1://En caso de ser tipo 1 se genera un item de numero (Si existen aun)
          if(this.prev_score.tipoNumero > 0){
            this.prev_score.tipoNumero -= 1; 
            continuar = true;
          }else if(this.prev_score.tipoNumero == 0){
            this.itemsCompletos++;
            this.prev_score.tipoNumero = -1;
          }
          break;
        case 2://En caso de ser tipo 2 se genera un item booleano (Si existen aun)
          if(this.prev_score.tipoBool > 0){
            this.prev_score.tipoBool -= 1;   
            continuar = true;
          }else if(this.prev_score.tipoBool == 0){
            this.itemsCompletos++;
            this.prev_score.tipoBool = -1;
          }
          break;
        case 3://En caso de ser tipo 3 se genera un item de array (Si existen aun)
          if(this.prev_score.tipoArray > 0){
            this.prev_score.tipoArray -= 1;    
            continuar = true;
          }else if(this.prev_score.tipoArray == 0){
            this.itemsCompletos++;
            this.prev_score.tipoArray = -1;
          }
          break;
      }
      if(continuar){//En caso de autorizar la creación de item
        var item = this.items.create(xItem, yItem, 'item', tipo);
        item.tipo = tipo;
        item.body.velocity.y = -this.vel;
        item.inputEnabled = true;
        item.events.onInputDown.add(this.clickItem, this);
        item.events.onInputUp.add(this.releaseItem, this);
        continuar = false;
      }
    },

    clickItem: function(item){
      this.itemSelec = true;
      item.movimiento = true;

      var txtItem = "";
      //Se define el texto a mostrar de acuerdo a el tipo de item seleccionado
      switch(item.tipo){
        case 0:
          txtItem = this.stringItems[Math.floor(Math.random() * (this.stringItems.length))];
          break;
        case 1:
          txtItem = this.numberItems[Math.floor(Math.random() * (this.numberItems.length))];
          break;
        case 2:
          txtItem = this.booleanItems[Math.floor(Math.random() * (this.booleanItems.length))];
          break;
        case 3:
          txtItem = this.arrayItems[Math.floor(Math.random() * (this.arrayItems.length))];
          break;
      }

      this.textoItem = this.game.add.text(item.body.x , (item.body.y - 35), txtItem, { font: '24px calibri', fill: '#000', align:'center'});
    },

    releaseItem: function(item){
      //Se comprueba que el item haya tocado alguno de los tubos o contenedores
      if(item.movimiento == true){
        var tempScore = this.score;
        var tempScoreText = this.scoreText;
        var tempError_score = this.error_score;
        var error_sound_temp = this.error_sound;
        var error = true;
        var fueraTubo = true;
        var finalizarForech = false;   
        this.tubos.forEach(function(tubo) {
          if(!finalizarForech){
            if(item.body.x>tubo.body.x && item.body.y>tubo.body.y && item.body.y<(tubo.body.y + tubo.body.height)){
              fueraTubo = false;
              if(item.tipo == tubo.tipo){//Se verifica que sean el mismo tipo de dato
                error = false;
                switch(item.tipo){
                  case 0:
                    tempScore.tipoCadena++;
                    tempScoreText[0].text = tempScore.tipoCadena;
                  break;
                  case 1:
                    tempScore.tipoNumero++;
                    tempScoreText[1].text = tempScore.tipoNumero;
                    break;
                  case 2:
                    tempScore.tipoBool++;
                    tempScoreText[2].text = tempScore.tipoBool;
                    break;
                  case 3:
                    tempScore.tipoArray++;
                    tempScoreText[3].text = tempScore.tipoArray;
                    break;
                }
                finalizarForech = true;
              }
            }
          }
        });
        if(error){
          if(fueraTubo){
            tempError_score.errorGeneral++;
          }else{
            switch(item.tipo){
                case 0:
                  tempError_score.errorCadena++;
                break;
                case 1:
                  tempError_score.errorNumero++;
                break;
                case 2:
                  tempError_score.errorBool++;
                break;
                case 3:
                  tempError_score.errorArray++;
                break;              
            }    
          }     
          error_sound_temp.play();
          this.error_score = tempError_score;
          console.log(this.error_score);
          if(fueraTubo){this.ErrorScore(4);}else{this.ErrorScore(item.tipo);}
        }        
        this.score = tempScore;
        this.scoreText = tempScoreText;
        this.itemSelec = false;
        this.textoItem.destroy();
        item.kill();
      }
    },

    clickListener: function(){

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
    },

    ErrorScore: function(tipo){
        var inicio = tipo + ( 3 * tipo);
        var final_ = inicio + 3;
        var frame = Math.floor((Math.random()*final_) + inicio);        
        switch(tipo){
          case 0:
            if(this.error_score.errorCadena != 0 && (this.error_score.errorCadena%3) == 0 ){
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;              
            }                
          break;
          case 1:
            if(this.error_score.errorNumero != 0 && (this.error_score.errorNumero%3) == 0 ){
              this.MensajeAyuda =this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;              
            }                                  
          break;
          case 2:
            if(this.error_score.errorBool != 0 && (this.error_score.errorBool%3) == 0 ){
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;              
            }                                
          break;
          case 3:
            if(this.error_score.errorArray != 0 && (this.error_score.errorArray%3) == 0 ){
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;
            }                                  
          break; 
          case 4:
            if(this.error_score.errorGeneral != 0 && (this.error_score.errorGeneral%5) == 0 ){
              this.MensajeAyuda = this.game.add.sprite(this.game.world.centerX - 138, this.game.world.centerY - 90,'MensajeAyuda',frame);
              this.game.paused = true;        
            }
          break;             
        }        
    },

    enPausa:function(event){
      if(this.game.paused){
        this.MensajeAyuda.destroy();
        this.game.paused = false;
      }      
    }

  };  
 

  module.exports = Nivel1_1;

  
},{"../prefabs/pause":2}],9:[function(require,module,exports){

  'use strict';

  var textBox = require('../prefabs/textBox');
  var mouseSpring;

  function Nivel2() {}
  Nivel2.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 120,
    prev_score: {},
    prev_score_base: {},
    itemsCompletos: 0,
    vel:100,//Velocidad de inicio para movimiento de items
    itemSelec: false,

    mover:false,
    lanzamiento:false,
    enPregunta:false,

    //Definicion temporal de preguntas para mostrar por tipo de dato
    stringItems: new Array({pregunta:'Nombre?',variable:'nombre'},{pregunta:'Direccion?',variable:'direccion'}),
    numberItems: new Array({pregunta:'Telefono?',variable:'tel'},{pregunta:'Edad?',variable:'edad'},{pregunta:'Peso?',variable:'peso'}),
    booleanItems: new Array({pregunta:'Es niño?',variable:'nino'}),
    arrayItems: new Array({pregunta:'Nombre?',variable:'nombre'},{pregunta:'Direccion?',variable:'direccion'}),

    create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);//Habilita colision para este tipo de fisicas
      this.game.physics.p2.restitution = 0;
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.loop_creaItem = this.tiempo.loop(4000, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel2');
   
      //Creacion de grupos de colision
      this.lanzadorGrupoColision = this.game.physics.p2.createCollisionGroup();
      this.itemsGrupoColision = this.game.physics.p2.createCollisionGroup();

      //Se realiza creacion de la resortera (lanzador)
      this.nuevoLanzador();

      //Se realiza creacion de la resortera (base)
      this.game.add.sprite(188, this.game.world.height - 160, 'resortera');
      this.resortera = this.game.add.sprite(204, this.game.world.height - 147, '');
      this.game.physics.p2.enable(this.resortera,false);
      this.resortera.body.static = true;
      this.resortera.body.setCircle(5);

      this.resorte = new Phaser.Line(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.physicsBodyType = Phaser.Physics.P2JS;

      //Grupo de log de resultados 
      this.logResultados = this.game.add.group();
      this.logResultados.ultY = 10;

      //Se setea el texto para el cronometro
      this.timer = this.game.add.text(((this.game.width)/2), 16 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });
      this.timer.fixedToCamera = true; 
    },

    update: function(){
      /*Validaciones sobre resortera*/
      if(!this.lanzamiento){
        this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
      }else{
        this.lanzador.angle += 1;
      }
      if(this.mover){
        this.lanzador.body.x = this.game.input.x;
        this.lanzador.body.y = this.game.input.y;
      }

      /*Validaciones sobre municiones de lanzamiento*/
      if(this.lanzador.body.x < 0 || this.lanzador.body.x > 800 || this.lanzador.body.y < 0 || this.lanzador.body.y > 600){
        this.lanzador.destroy();
        this.nuevoLanzador();
      }

      /*Validaciones sobre items*/
      this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){
          item.body.velocity.y = 0;//Se retira el movimiento vertical
          item.body.x = mouseX
          item.body.y = mouseY;
        }

        //Se verifica que los items no hayan superado los limites del escenario
        if(((item.body.y+item.body.height) < 0) || ((item.body.x+item.body.width) < 0)){
          item.kill();
        }
      }); 
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
        this.items.destroy();
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


    crearItem: function(){
      var puntoPartida = Math.floor(Math.random() * 2);//Numero aleatorio entre 0 y 1
      var xItem = 0;
      var yItem = 0;
      var velX = 0;
      var velY = 0;
      if(puntoPartida == 0){//Punto de partida desde abajo, forma vertical
        yItem = this.game.height;
        xItem = Math.floor(Math.random() * ((this.game.width)/2)) + (this.game.width/2);//Numero aleatorio desde la mitad del escenario
        velY = -100;
      }else{//Punto de partida desde lateral, forma horizontal
        xItem = this.game.width;
        yItem = Math.floor(Math.random() * (this.game.height));//Numero aleatorio a lo largo del escenario        
        velY = -50;
        velX = -100;
      }
      var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 4;
      var item = this.items.create(xItem, yItem, 'item', tipo);//Creacion del item
      item.tipo = tipo;
      item.body.collideWorldBounds = false;
      item.body.setCircle(10);
      item.body.velocity.x = velX;
      item.body.velocity.y = velY;
      item.body.setCollisionGroup(this.itemsGrupoColision);
      item.body.collides([this.lanzadorGrupoColision]);
    },

    nuevoLanzador: function(){
      var tipo = Math.floor(Math.random()*3);
      tipo = tipo * 3;
      this.lanzador = this.game.add.sprite(120, this.game.world.height - 100, 'lanzador');
      this.lanzador.animations.add('idle', [tipo,tipo+1,tipo+2], 10, true,60, true);
      this.lanzador.animations.play('idle');
      this.game.physics.p2.enable(this.lanzador,false);
      this.lanzador.body.collideWorldBounds = false;
      this.lanzador.inputEnabled = true;
      this.lanzador.body.setCircle(18);
      //this.lanzador.body.data.shapes[0].sensor = true;
      //Se establecen las colisiones contra los objetos de item
      this.lanzador.body.setCollisionGroup(this.lanzadorGrupoColision);
      this.lanzador.body.collides(this.itemsGrupoColision,this.hitItem,this);
      //Se establecen los eventos de click para manipulacion del lanzador
      this.lanzador.events.onInputDown.add(this.clickLanzador, this);
      this.lanzador.events.onInputUp.add(this.releaseLanzador, this);
    },

    hitItem: function(body1,body2){
      //Se establecen las variables de validacion
      this.tipoValida = body2.sprite.tipo;
      //Se destruyen los elementos de colision
      body2.sprite.kill();
      body1.sprite.destroy();
      this.enPregunta = true;
      switch(this.tipoValida){//Tipo de variable sobre el cual se realizara la definicion
        case 0://Tipo string
          this.textoPregunta = this.stringItems[Math.floor(Math.random() * this.stringItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
        case 1://Tipo number
          this.textoPregunta = this.numberItems[Math.floor(Math.random() * this.numberItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
        case 2://Tiipo bool
          this.textoPregunta = this.booleanItems[Math.floor(Math.random() * this.booleanItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
        case 3://Tipo array
          this.textoPregunta = this.arrayItems[Math.floor(Math.random() * this.arrayItems.length)];//Numero aleatorio entre 0 y longitud de array
          break;
      }
      /*Se realiza la creacion del grupo de pregunta para la variable*/
      this.grupoPregunta = this.game.add.group();
      this.grupoPregunta.add(this.game.add.text( 300, 225 , this.textoPregunta.pregunta, { font: '24px calibri', fill: '#000', align:'center'}));
      this.grupoPregunta.add(this.game.add.text( 300, 250 , 'var', { font: '24px calibri', fill: '#00f', align:'center'}));
      this.varTemp = this.grupoPregunta.add(this.game.add.text( 335, 250 , this.textoPregunta.variable, { font: '24px calibri', fill: '#000', align:'center'}));
      this.grupoPregunta.add(this.game.add.text( (this.varTemp.x + this.varTemp.width + 5), 250 , '=', { font: '24px calibri', fill: '#800080', align:'center'}));
      this.cajaTexto = new textBox(this.game,(this.game.width/2)-100,(this.game.height/2)-25,200,25,"Escribe aqui");
      this.grupoPregunta.add(this.cajaTexto);
      this.btnValidar = this.game.add.button((this.game.width/2) - 50, (this.game.height/2), 'btnContinuar', this.validarRespuesta, this);
      this.grupoPregunta.add(this.btnValidar);
      //this.game.paused = true;
      //updateAlterno(this.game);
    },

    validarRespuesta: function(){
      var error = true;
      switch(this.tipoValida){
        case 0://Solicitud variable de tipo string
          if(/^(\"(\w)*\")|(\'(\w)*\')$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
          }
          break;
        case 1://Solicitud variable de tipo numerico
          if(/^(?:\+|-)?\d+$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
          }
          break;
        case 2://Solicitud variable de tipo booleano
          if(this.cajaTexto.texto.text == "true" || this.cajaTexto.texto.text == "false"){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
          }
          break;
        case 3://Solicitud variable de tipo array
          if(/^([{1})([0-9a-zA-Z])(]{1})$/.test(this.cajaTexto.texto.text)){
            //En caso de respuesta correcta
            console.log(true);
            error = false;
          }else{
            //En caso de respuesta incorrecta
            console.log(false);
          }
          break;
      }
      //Se registra el log de resultados
      this.ultResultado = this.logResultados.add(this.game.add.text( 5, this.logResultados.ultY , 'var '+this.textoPregunta.variable+' = '+this.cajaTexto.texto.text, { font: '12px calibri', fill: '#000', align:'center'}));
      this.logResultados.ultY += 10;
      if(error){
        this.logResultados.add(this.game.add.text( (this.ultResultado.x + this.ultResultado.width + 5), this.ultResultado.y , '-10', { font: '12px calibri', fill: '#f00', align:'center'}));
        this.error_sound.play();
      }else{        
        this.logResultados.add(this.game.add.text( (this.ultResultado.x + this.ultResultado.width + 5), this.ultResultado.y , '+20', { font: '12px calibri', fill: '#0f0', align:'center'}));
      }
      this.cajaTexto.destruir();
      this.grupoPregunta.destroy();
      this.nuevoLanzador();
    },

    clickLanzador: function(){
      this.lanzamiento = false;
      this.lanzador.body.static = false;
      mouseSpring = this.game.physics.p2.createSpring(this.resortera.body,this.lanzador.body, 0, 20, 1);
      this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x,this.resortera.y);
      this.mover = true;
    },

    releaseLanzador: function(){
      this.game.physics.p2.world.springs.splice(0,this.game.physics.p2.world.springs.length);//this.game.physics.p2.removeSpring(mouseSpring);
      this.mover = false;
      this.lanzamiento = true;
    },

    preRender: function(){
      if(!this.lanzamiento){
        this.resorte.setTo(this.lanzador.x, this.lanzador.y, this.resortera.x, this.resortera.y);
      }
    },

    render: function() {
      if(!this.lanzamiento){
        this.game.debug.geom(this.resorte);  
      }
    },

    clickListener: function(){
      
    }
  };

  function updateAlterno(game){
    if(game.paused){
      setTimeout(updateAlterno,50,game);
    }
  }
  
  module.exports = Nivel2;
},{"../prefabs/textBox":3}],10:[function(require,module,exports){

  'use strict';

  function Nivel3() {}
  Nivel3.prototype = {

    //Definición de propiedades
    score: 0,
    maxtime: 120,
    prev_score: {},
    prev_score_base: {},
    itemsCompletos: 0,
    vel:100,//Velocidad de inicio para movimiento de items
    itemSelec: false,

    //Variables de control
    colocados: 0,
    solicitado: true,
    resp_time:20,

    //Definicion temporal de preguntas para mostrar por tipo de dato
    datosItems: new Array({texto:'nombre("Maria")',variable:'nombre',dato:"Maria"},{texto:'"Maria"',dato:'"Maria"'}),
    operadorItems: new Array('>','<','>=','<=','==','!='),

    create: function() {
      //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);//Habilita colision para este tipo de fisicas
      this.game.physics.p2.restitution = 0;
      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contadores de juego
      this.tiempo.start();

      //Se definen los audios del nivel
      this.error_sound = this.game.add.audio('error_sound');

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel2');

      //Se realiza la creacion del grupo de slots o contenedores
      this.slots = this.game.add.group();
      this.slots.enableBody = true;
      var ySlot = 110;
      for(var i =0; i<3;i++){
        var slot = this.slots.create(600,ySlot,'slot');
        slot.tipo = i;//El tipo define: 0->Dato 1 - 1->Operador - 2->Dato 2
        slot.usado = false;
        ySlot += 110;
      }

      //Se realiza la creacion del grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      //Se genera una matriz de items de 5 por 5
      var xItems = 70;
      var yItems = 70;
      for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
          var item = this.crearItem(xItems,yItems);
          item.i = i;
          item.j = j;
          xItems += 85;
        }
        xItems = 70;
        yItems += 85;
      }

      //Creacion de texto de puntaje
      this.scoreText = this.game.add.text(580 , 450, 'Puntaje: 0', { font: '24px calibri', fill: '#000', align:'center'});
      this.solicitud();
    },

    update: function(){
      //Se obtienen las posiciones del cursor en el juego
      var mouseX = this.game.input.x;
      var mouseY = this.game.input.y;
      //Se realizan las validaciones sobre el grupo de items
      this.items.forEach(function(item) {
        //Se verifican los items para realizar su movimiento en caso de click
        if(item.movimiento == true){
          item.body.x = mouseX - item.body.width/2;
          item.body.y = mouseY - item.body.height/2;
          if(item.texto){
            item.texto.x = mouseX - item.body.width/2;
            item.texto.y = mouseY - item.body.height/2;
          }
        }
      });
    },

    solicitud:function(){
      var sol = Math.floor(Math.random()*2);
      if(sol == 0){//Solicitud de veradero{}
        this.solicitado = true;
      }else{//Solicitud de falso
        this.solicitado = false;
      }
      if(this.solicitudTxt){
        this.solicitudTxt.setText(this.solicitado);
      }else{
        this.solicitudTxt = this.game.add.text(600,85,this.solicitado.toString(),{ font: '24px calibri', fill: '#000', align:'center'});
      }
      if(this.solicitudTime){
        this.resp_time = 20;
      }else{
        this.solicitudTime = this.game.add.text(610 + this.solicitudTxt.width,85,'',{ font: '24px calibri', fill: '#000', align:'center'});
      }
      this.slots.forEach(function(slot) {
        if(slot.item){
          if(slot.item.texto){slot.item.texto.destroy();}
          slot.item.destroy();
          slot.usado = false;
        }
      });
      this.colocados = 0;
    },

    updateTimer: function(){
      //Se comprueba que el tiempo de juego haya terminado
      /*if(this.maxtime == 0){
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
      }*/
      /*Se comprueba el tiempo por respuesta*/
      if(this.resp_time == 0){
        this.solicitud();
      }

      var minutos = 0;
      var segundos = 0;
        
      if(this.resp_time/60 > 0){
        minutos = Math.floor(this.resp_time/60);
        segundos = this.resp_time%60;
      }else{
        minutos = 0;
        segundos = this.resp_time; 
      }
      
      //Se realiza la actualizacion de los contadores de tiempo de juego
      this.resp_time--;
        
      //Se agrega cero a la izquierda en caso de ser de un solo digito   
      if (segundos < 10)
        segundos = '0' + segundos;
   
      if (minutos < 10)
        minutos = '0' + minutos;
   
      this.solicitudTime.setText(minutos + ':' +segundos);
    },

    crearItem: function(xItem,yItem){
      var defineTipo = Math.floor(Math.random() * 100);//Numero aleatorio de 1 a 100 para simular un porcentaje de 100
      var tipo = 0;
      if(defineTipo >= 0 && defineTipo < 45){//0 - 44 --> Item de dato
        tipo = 1;
      }else if(defineTipo >= 45 && defineTipo < 90){//45 - 89 --> Item de operador logico
        tipo = 2;
      }else{//90 - 99 --> Item comodin
        tipo = 0;
      }
      var item = this.items.create(xItem,yItem,'item3',tipo);
      item.tipo = tipo;
      switch(item.tipo){
        case 0:

          break;
        case 1:
          var info = this.datosItems[Math.floor(Math.random() * this.datosItems.length)];
          if(info.variable){
            item.variable = info.variable;
          }
          item.dato = info.dato;
          item.texto = this.game.add.text(item.x + (item.width/2), item.y, info.texto, { font: '12px calibri', fill: '#000', align:'center'});
          break;
        case 2:
          var info = this.operadorItems[Math.floor(Math.random() * this.operadorItems.length)]
          item.dato = info;
          item.texto = this.game.add.text(item.x + (item.width/2), item.y, this.operadorItems[Math.floor(Math.random() * this.operadorItems.length)], { font: '12px calibri', fill: '#000', align:'center'});
          break;
      }
      item.usado = false;
      item.inputEnabled = true;
      item.events.onInputDown.add(this.clickItem, this);
      item.events.onInputUp.add(this.releaseItem, this);
      return item;
    },

    clickItem: function(item){
      if(!item.usado){
        item.movimiento = true;
        item.usado = true;
        item.bringToTop();
        this.items.updateZ();

        var item_nuevo = this.crearItem(item.x, -15);
        item_nuevo.i = -1;
        item_nuevo.j = item.j;

        this.items.forEach(function(item_) {
          if(item_.i < item.i && item_.j == item.j && !item_.usado){
            item_.game.add.tween(item_).to({y:item_.y+85}, 350, Phaser.Easing.Linear.None, true);
            if(item_.texto){
              item_.game.add.tween(item_.texto).to({y:item_.texto.y+85}, 350, Phaser.Easing.Linear.None, true);
            }
            item_.i++;
          }
        });        
      }
    },

    releaseItem: function(item){
      if(item.movimiento){
        item.movimiento = false;
        var itemsTemp = this.items;
        var colocadosTemp = this.colocados;
        var puesto = false;
        this.slots.forEach(function(slot) {
          if(!puesto){
            if(item.overlap(slot) && !slot.usado){
              if(item.variable){
                item.texto.text = item.variable;
              }else{
                if(item.dato){
                  item.texto.text = item.dato;
                }
              }
              item.x = slot.body.x + (slot.body.width - item.body.width)/2;
              item.y = slot.body.y + (slot.body.height - item.body.height)/2;
              slot.usado = true;
              slot.item = item;
              colocadosTemp++;
              puesto = true;
            }
          }
        });
        if(!puesto){
          item.texto.destroy();
          item.destroy();
        }
        this.colocados = colocadosTemp;
        if(this.colocados == 3){//Se realiza la validacion y asignacion de datos para comprobacion de respuestas correctas o incorrectas
          var correcto = true;
          var contComodin = 0;
          var dato1, dato2, operador;
          this.slots.forEach(function(slot) {
            switch(slot.tipo){
              case 0://Slot dato 1
                if(slot.item.tipo == 0){//Tipo de comodin
                  contComodin++;
                }else if(slot.item.tipo == 1){//En caso de tipo dato se asigna
                  dato1 = slot.item.dato;
                }else{//En caso de tipo operador en primer slot e genera error
                  correcto = false;
                }
                break;
              case 1://Slot operador logica
                if(slot.item.tipo == 2){//Tipo de operador logico
                  operador = slot.item.dato;
                }else if(slot.item.tipo == 0){//Tipo de comodin
                  contComodin++;
                }else{
                  correcto = false;
                }
                break;
              case 2://Slot dato 2
                if(slot.item.tipo == 0){//Tipo de comodin
                  contComodin++;
                }else if(slot.item.tipo == 1){//En caso de tipo dato se asigna
                  dato2 = slot.item.dato;
                }else{//En caso de tipo operador en primer slot e genera error
                  correcto = false;
                }
                break;
            }  
            if(slot.item.texto){slot.item.texto.destroy();}
            slot.item.destroy();
            slot.usado = false;          
          });
          this.colocados = 0;
          if(correcto){//En caso de contar con items apropiados para cada slot se valida que sea sentencia apropiada y con sentido
            if(contComodin == 3){//En caso de ser puntaje de comodin
              this.score += 50;
            }else{//Se valida la respuesta
              var sumaPuntos = true;
              switch(operador){
                case ">":
                  break;
                case "<":
                  break;
                case ">=":
                  break;
                case "<=":
                  break;
                case "==":
                  if(dato1 != dato2){
                    sumaPuntos = false;
                  }
                  break;
                case "!=":
                  if(dato1 == dato2){
                    sumaPuntos = false;
                  }
                  break;
              }
              if(sumaPuntos){
                this.score += 20;
              }
            }
            this.scoreText.text = 'Puntaje: ' + this.score;
            contComodin = 0;
          }
          this.solicitud();
        }
      }
    }
  };

  module.exports = Nivel3;
},{}],11:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      /*this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);*/

      this.nivel1 = this.game.add.sprite(this.game.width/3, 20,'nivel1');
      this.nivel1.nivel = 'nivel1';
      this.nivel1.inputEnabled = true;
      this.nivel1.events.onInputDown.add(this.clickListener, this);

      this.nivel2 = this.game.add.sprite(this.game.width/3, 110,'nivel2');
      this.nivel2.nivel = 'nivel2'
      this.nivel2.inputEnabled = true;
      this.nivel2.events.onInputDown.add(this.clickListener, this);

      this.nivel3 = this.game.add.sprite(this.game.width/3, 200,'nivel2');
      this.nivel3.nivel = 'nivel3'
      this.nivel3.inputEnabled = true;
      this.nivel3.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function(boton) {
      this.game.state.start(boton.nivel);
    }
  };
  
  module.exports = Play;
},{}],12:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/images/yeoman-logo.png');

    /*Imagenes Menu*/
    this.load.image('nivel1', 'assets/images/Menu/nivel1.png');
    this.load.image('nivel2', 'assets/images/Menu/nivel2.png');

    /*Botones*/
    this.load.image('btnContinuar', 'assets/images/Botones/btnContinuar.png');
    this.load.spritesheet('btnPausa', 'assets/images/Botones/btnPausa.png',71,71);
    this.load.image('fondoPausa', 'assets/images/Botones/fondoPausa.png');

    /*Imagenes nivel 1*/
    this.load.image('tile_nivel1', 'assets/images/Nivel 1/tile.jpg');
    this.load.image('piso', 'assets/images/Nivel 1/piso.jpg');
    this.load.image('plataforma', 'assets/images/Nivel 1/plataforma.jpg');
    this.load.spritesheet('item', 'assets/images/Nivel 1/item.png',32,31);
    this.load.spritesheet('personaje', 'assets/images/personaje.png', 48, 68);
    this.load.image('score', 'assets/images/Nivel 1/score_1_1.png');
    this.load.spritesheet('tubo', 'assets/images/Nivel 1/tubo.png',190,100);
    this.load.spritesheet('MensajeAyuda','assets/images/Nivel 1/msjs.png',275,180);

    /*Imagenes nivel 2*/
    this.load.image('tile_nivel2', 'assets/images/Nivel 2/tile.jpg');
    this.load.image('resortera', 'assets/images/Nivel 2/resortera.png');
    this.load.image('resorte', 'assets/images/Nivel 2/resorte.png');
    this.load.spritesheet('lanzador','assets/images/Nivel 2/piedras.png',46,53);
    this.load.image('ancla', 'assets/images/Nivel 2/ancla.png');

    /*Imagenes nivel 3*/
    this.load.spritesheet('item3','assets/images/Nivel 3/items.png',80,80);
    this.load.image('slot','assets/images/Nivel 3/slot.png');

    /*Audios de juego*/
    this.load.audio('error_sound', 'assets/audio/generales/error.wav');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])