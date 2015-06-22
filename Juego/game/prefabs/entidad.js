'use strict';

var Entidad = function(game, x, y, key) {
  Phaser.Sprite.call(this, game, x, y, key, 0);

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
    this.txtMostrar = this.game.add.text(this.x + this.width,this.y,msj,{ font: '12px consolas', fill: '#fff', align:'left'});
    this.txtMostrar.anchor.setTo(0,0);
    this.txtMostrar.wordWrap = true;
    this.txtMostrar.wordWrapWidth = 120;
    this.txtMostrar.alpha = 0;
  }else{
    this.txtMostrar.x = this.x + this.width;
    this.txtMostrar.y = this.y;
    this.txtMostrar.setText(msj);//Se establece el texto del mensaje
  }
  if(!msj){//Texto por defecto
    this.txtMostrar.setText("Hola");
  }
  this.msjBandera = true;
  this.game.add.tween(this.txtMostrar).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  setTimeout(this.ocultar,5000,this);//Se realiza el llamado de metodo para ocultar mensaje en 5 segundos
};

Entidad.prototype.ocultar = function(e) {
  //Animacion para ocutar mensaje
  e.game.add.tween(e.txtMostrar).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
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
