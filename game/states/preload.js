
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

    /*Imagenes Menu e intro*/
    this.load.image('intro', 'assets/images/Menu/intro.jpg');
    this.load.spritesheet('nivel1', 'assets/images/Menu/nivel1.jpg',800,100);
    this.load.spritesheet('nivel2', 'assets/images/Menu/nivel2.jpg',800,100);
    this.load.spritesheet('nivel3', 'assets/images/Menu/nivel3.jpg',800,100);
    this.load.spritesheet('nivel4', 'assets/images/Menu/nivel4.jpg',800,100);
    this.load.spritesheet('nivel5', 'assets/images/Menu/nivel2.jpg',800,100);
    this.load.spritesheet('nivel6', 'assets/images/Menu/nivel6.jpg',800,100);
    this.load.spritesheet('ayudaGeneral', 'assets/images/Menu/ayuda.jpg',800,600);

    /*Botones y generales*/
    this.load.image('btnContinuar', 'assets/images/Botones/btnContinuar.png');
    this.load.spritesheet('btnPausa', 'assets/images/Botones/btnPausa.png',45,45);
    this.load.image('fondoPausa', 'assets/images/Botones/fondoPausa.png');
    this.load.image('time','assets/images/Botones/time.png');
    this.load.spritesheet('OpcPausa', 'assets/images/Botones/opcPausa.png',54,49);

    /*Imagenes nivel 1*/
    this.load.image('tile_nivel1', 'assets/images/Nivel 1/tile.jpg');
    this.load.image('piso', 'assets/images/Nivel 1/piso.jpg');
    this.load.image('plataforma', 'assets/images/Nivel 1/plataforma.jpg');
    this.load.spritesheet('item', 'assets/images/Nivel 1/item.png',32,31);
    this.load.spritesheet('personaje', 'assets/images/personaje.png', 48, 68);
    this.load.image('score1', 'assets/images/Nivel 1/score_1.png');
    this.load.image('score1_1', 'assets/images/Nivel 1/score_1_1.png');
    this.load.spritesheet('tubo', 'assets/images/Nivel 1/tubo.png',190,100);
    this.load.spritesheet('MensajeAyuda','assets/images/Nivel 1/msjs.png',234,135);
    this.load.image('introN1', 'assets/images/Nivel 1/intro.jpg');

    /*Imagenes nivel 2*/
    this.load.image('tile_nivel2', 'assets/images/Nivel 2/tile.jpg');
    this.load.image('resortera', 'assets/images/Nivel 2/resortera.png');
    this.load.spritesheet('lanzador','assets/images/Nivel 2/piedras.png',46,53);
    this.load.spritesheet('personaje2','assets/images/Nivel 2/jugador.png',49,75);
    this.load.spritesheet('explosion','assets/images/Nivel 2/explosion.png',84,93);
    this.load.spritesheet('MensajeAyuda2','assets/images/Nivel 2/msjs.png',234,135);
    this.load.image('introN2', 'assets/images/Nivel 2/intro.jpg');

    /*Imagenes nivel 3*/
    this.load.image('tile_nivel3', 'assets/images/Nivel 3/tile.jpg');
    this.load.image('fondo3', 'assets/images/Nivel 3/cuadros.png');
    this.load.spritesheet('item3','assets/images/Nivel 3/items.png',80,80);
    this.load.image('slot','assets/images/Nivel 3/slot.png');
    this.load.image('introN3', 'assets/images/Nivel 3/intro.jpg');
    this.load.spritesheet('MensajeAyuda3','assets/images/Nivel 3/msjs.png',275,180);

    /*Imagenes nivel 4*/
    this.load.image('tile_nivel4','assets/images/Nivel 4/tile.png');
    this.load.image('slotIF','assets/images/Nivel 4/slot.png');
    this.load.image('accion_large','assets/images/Nivel 4/accion_large.png');
    this.load.image('accion_small','assets/images/Nivel 4/accion_small.png');
    this.load.image('condicion','assets/images/Nivel 4/condicion.png');
    this.load.image('btnEjecutar4','assets/images/Nivel 4/btnEjecutar.png');
    this.load.image('fondosituacion','assets/images/Nivel 4/fondosituacion.png');
    this.load.image('fondoPasos4','assets/images/Nivel 4/fondoPasos.png');

     /*Imagenes nivel 5*/
    this.load.image('btnfor','assets/images/Nivel 5/btnfor.jpg');
    this.load.image('btnwhile','assets/images/Nivel 5/btnwhile.jpg');    


    /*Imagenes nivel 6 - Editor de codigo*/
    this.load.image('tile_nivel6', 'assets/images/Nivel 6/tile.png');
    this.load.image('introN6', 'assets/images/Nivel 6/intro.jpg');
    this.load.spritesheet('dude','assets/images/personaje_50.png',35,50);
    this.load.image('btnSiguiente6','assets/images/Nivel 6/btnSiguiente.png');
    this.load.image('btnEjecutar6','assets/images/Nivel 6/btnEjecutar.png');
    this.load.image('fondoEditor','assets/images/Nivel 6/fondoEditor.png');
    this.load.image('fondoPasos','assets/images/Nivel 6/fondoPasos.png');
    this.load.image('fondoTablero','assets/images/Nivel 6/fondoTablero.png');
    this.load.image('globo1','assets/images/Nivel 6/globo1.png');
    this.load.image('globo2','assets/images/Nivel 6/globo2.png');
    this.load.image('globo3','assets/images/Nivel 6/globo3.png');  

    /*Audios de juego*/
    this.load.audio('error_sound', 'assets/audio/generales/error.wav');
    this.load.audio('jump_sound', 'assets/audio/generales/salto.wav');

    /*Bitmap text*/
    this.load.bitmapFont('font1', 'assets/fonts/font1/font1.png', 'assets/fonts/font1/font1.fnt');
    this.load.bitmapFont('font', 'assets/fonts/font/font.png', 'assets/fonts/font/font.fnt');
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
