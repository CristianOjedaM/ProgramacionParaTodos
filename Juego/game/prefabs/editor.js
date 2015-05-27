'use strict';

var Editor = function(game, x, y ,width , heigth, parent){
  Phaser.Group.call(this, game, parent);

  /*Definicion de propiedades*/
  this.defaultTxt = '';
  this.seleccionado = true;
  this.shift = false;
  //Se dibuja la caja de texto
  this.cajaTexto = game.add.graphics( 0, 0 );
  this.cajaTexto.beginFill(0xFFFFFF, 1);
  this.cajaTexto.bounds = new PIXI.Rectangle(x, y, width, heigth);
  this.cajaTexto.drawRect(x, y, width, heigth);
  this.add(this.cajaTexto);
  //Se define el texto
  this.texto = game.add.text(x , y, this.defaultTxt, { font: '24px calibri', fill: '#000', align:'center'});
  this.textData = "";
  
  //this.inputEnabled = true;
  game.input.keyboard.addCallbacks(this, this.keyPress, this.keyUp, null);
  //this.events.onInputDown.add(this.seleccionar, this);
};

Editor.prototype = Object.create(Phaser.Group.prototype);
Editor.constructor = Editor;

Editor.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Editor.prototype.seleccionar = function() {
	this.seleccionado = true;
};

Editor.prototype.keyPress = function(data) {
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
        case 188://Tecla para comas (,)
          if(this.shift){
            this.textData += ";";
            this.texto.text = this.textData;
          }else{
            this.textData += ",";
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

Editor.prototype.keyUp = function(data) {
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

Editor.prototype.destruir = function() {
  this.cajaTexto.destroy();
  this.texto.destroy();
  this.seleccionado = false;
  this.destroy();
};

module.exports = Editor;
