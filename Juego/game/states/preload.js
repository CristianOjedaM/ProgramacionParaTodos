
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
    this.load.spritesheet('btnPausa', 'assets/images/Botones/btnPausa.png',45,45);
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
    this.load.spritesheet('lanzador','assets/images/Nivel 2/piedras.png',46,53);
    this.load.spritesheet('personaje2','assets/images/Nivel 2/jugador.png',49,75);

    /*Imagenes nivel 3*/
    this.load.spritesheet('item3','assets/images/Nivel 3/items.png',80,80);
    this.load.image('slot','assets/images/Nivel 3/slot.png');

    /*Audios de juego*/
    this.load.audio('error_sound', 'assets/audio/generales/error.wav');
    this.load.audio('jump_sound', 'assets/audio/generales/salto.wav');

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
