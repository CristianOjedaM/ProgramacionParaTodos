'use strict';

var Entidad = function(game, x, y, key,frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  /*Definicion de propiedades*/
  this.posx = 0;//Posicion relativa de x en el tablero
  this.posy = 0;//Posicion relativa de y en el tablero
  this.propiedades = [{nombre:"Posicion X",prop:"posx",val:this.posx},
                {nombre:"Posicion Y",prop:"posy",val:this.posy}];
  this.consejos = ["consejo 1","consejo 2","consejo 3","consejo 4","consejo 5"];
};

Entidad.prototype = Object.create(Phaser.Sprite.prototype);
Entidad.prototype.constructor = Entidad;

Entidad.prototype.update = function() {
};

Entidad.prototype.mostrar = function(msj) {
  if(!this.txtMostrar){//Se realiza la cracion del mensaje
    this.txtFondo = this.game.add.sprite(this.x + (this.width * 3),this.y + 20,'globo1');
    this.txtFondo.anchor.setTo(0.5,0.5);
    this.txtMostrar = this.game.add.text(this.txtFondo.x,this.txtFondo.y,msj,{ font: '12px consolas', fill: '#000', align:'left'});
    this.txtMostrar.anchor.setTo(0.5,0.5);
    this.txtMostrar.wordWrap = true;
    this.txtMostrar.wordWrapWidth = 120;
    this.txtMostrar.alpha = 0;
    this.txtFondo.alpha = 0;
  }else{
    this.txtFondo.x = this.x + (this.width * 3);
    this.txtFondo.y = this.y + 20;
    this.txtMostrar.x = this.txtFondo.x;
    this.txtMostrar.y = this.txtFondo.y
    this.txtMostrar.setText(msj);//Se establece el texto del mensaje
  }
  if(!msj){//Texto por defecto
    this.txtMostrar.setText("Hola");
  }
  console.log('Heigth: '+this.txtMostrar.height);
  if(this.txtMostrar.height < 40){//En caso de contar con una linea
    this.txtFondo.loadTexture('globo1');
  }else if(this.txtMostrar.height < 87){//En caso de contar con dos hasta 4 lineas
    this.txtFondo.loadTexture('globo2');
  }else{//En caso de contrar con mas de 4 lineas
    this.txtFondo.loadTexture('globo3');
  }
  this.msjBandera = true;
  this.game.add.tween(this.txtMostrar).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  this.game.add.tween(this.txtFondo).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  setTimeout(this.ocultar,5000,this);//Se realiza el llamado de metodo para ocultar mensaje en 5 segundos
};

Entidad.prototype.ocultar = function(e) {
  //Animacion para ocutar mensaje
  e.game.add.tween(e.txtMostrar).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  e.game.add.tween(e.txtFondo).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  e.msjBandera = false;
  e.propBandera = false;
  e.consBandera = false;
};

Entidad.prototype.prop = function() {
  var retorno = "";
  for(var i=0;i<this.propiedades.length;i++){
    retorno += this.propiedades[i].nombre + ": " + this.propiedades[i].prop + "\n";
  }
  this.propBandera = true;
  return retorno;
};

Entidad.prototype.consejo = function() {
  var random = Math.floor(Math.random() * this.consejos.length);
  this.consBandera = true;
  return this.consejos[random];
};

module.exports = Entidad;
