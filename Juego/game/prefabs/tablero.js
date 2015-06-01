'use strict';

var Tablero = function(game, x, y ,xCuadros , yCuadros, parent){
  Phaser.Group.call(this, game, parent);  

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.xCuadros = xCuadros;
  this.yCuadros = yCuadros;
  this.dimension = 50;

  //Se dibuja el tablero con base en los valores de entrada
  for(var i=0;i<xCuadros;i++){
    for(var j=0;j<yCuadros;j++){
      this.dibujarCuadro(x+(i*this.dimension),y+(j*this.dimension),this.dimension);
    }
  }
};

Tablero.prototype = Object.create(Phaser.Group.prototype);
Tablero.constructor = Tablero;

Tablero.prototype.update = function() {
  
};

Tablero.prototype.dibujarCuadro = function(x,y,dimension) {
  var cuadro = this.game.add.graphics( 0, 0 );
  cuadro.beginFill(0x272822, 1);
  cuadro.lineStyle(2, 0xffffff);
  cuadro.bounds = new PIXI.Rectangle(x, y, dimension, dimension);
  cuadro.drawRect(x, y, dimension, dimension);
  this.add(cuadro);
};

Tablero.prototype.setObjCuadro = function(i, j, obj, sprite){
  if(obj != ''){
    var obj = this.game.add.sprite(this.x+(i*this.dimension),this.y+(j*this.dimension),obj);
    this.add(obj);
  }else{
    sprite.x = this.x+(i*this.dimension);
    sprite.y = this.y+(j*this.dimension);
    console.log(this.y);
  }
  return obj;
}

Tablero.prototype.destruir = function() {
 
};

module.exports = Tablero;