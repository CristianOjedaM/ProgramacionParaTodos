'use strict';

var Editor = function(game, x, y ,width , lines, parent){
  Phaser.Group.call(this, game, parent);

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.seleccionado = true;
  this.shift = false;//Control tecla shift
  this.hLinea = 14;//Tamaño de fuente 
  this.heigth = lines * this.hLinea;//Alto del editor
  this.created_lines = 0;//Lineas creadas
  this.current_line = 0;//Linea actual
  this.margen = 20;//Margen izquierda para texto de codigo
  this.lineas = new Array();//Array para control numero de lineas
  this.textos = new Array();//Array para control de textos por linea
  this.fills = {normal: "#000",editor: "#666",cadena: "#988927", reservado: "#E21335"}//Tipo de color de fuente
  this.font = { font: this.hLinea+'px consolas', fill: this.fills.normal, align:'center'};//Fuente unica para el editor
  this.reservados = /(\s)(if|else|for|while|switch|case|break)/ig;
  this.textData = ' ';//String para control de textos ingresados
  
  //Se dibuja la caja de texto
  this.cajaTexto = game.add.graphics( 0, 0 );
  this.cajaTexto.beginFill(0xFFFFFF, 1);
  this.cajaTexto.bounds = new PIXI.Rectangle(x, y, width, this.heigth);
  this.cajaTexto.drawRect(x, y, width, this.heigth);
  this.add(this.cajaTexto);
  
  //Se agrega el primer número de linea
  this.crearLinea();
  //Se realiza la creacion del pipe ( | )
  this.pipe = this.game.add.text((this.x+this.margen) ,(this.y+(this.current_line*this.hLinea)),'|',this.font);
  this.game.add.tween(this.pipe).to({alpha: 0}, 700, Phaser.Easing.Linear.NONE, true, 0, 1000, true);//Animacion de aparacion y desaparicion del pipe
  this.add(this.pipe);
  
  //Se establecen los eventos de teclas (presionada y soltada)
  this.game.input.keyboard.addCallbacks(this, this.keyPress, this.keyUp, null);
  //this.events.onInputDown.add(this.seleccionar, this);
};

Editor.prototype = Object.create(Phaser.Group.prototype);
Editor.constructor = Editor;

Editor.prototype.update = function() {
  
};

Editor.prototype.crearLinea = function() {
  if(this.created_lines == 0){
    this.current_line = this.created_lines;
  }else{
    this.current_line++;
  }
  var fontTemp  = this.font;
  fontTemp.fill = this.fills.editor;
  var nLinea = this.game.add.text(this.x+5,(this.y+(this.created_lines*this.hLinea)),(this.created_lines+1),fontTemp);
  this.lineas[this.created_lines] = nLinea;
  this.add(nLinea);

  var fontTemp2 = this.font;
  fontTemp2.fill = this.fills.normal;
  var ntexto = this.game.add.text((this.x + this.margen),(this.y+((this.created_lines)*this.hLinea)),'',fontTemp2);
  ntexto.ult_tinta = 0;
  ntexto.cont_string = 0;
  ntexto.tipo_string = "";
  this.textos[this.created_lines] = ntexto;
  this.add(ntexto);  

  this.created_lines++;
};

Editor.prototype.borrarLinea = function() {
  if(this.created_lines>0 && this.current_line>0){
    this.lineas[this.created_lines-1].destroy();
    if(this.current_line+1<this.created_lines){
      for(var i=this.created_lines;i>this.current_line;i--){
        this.textos[this.current_line].setText(this.textos[this.current_line+1].text);
        this.textos[this.current_line+1].destroy();
      }
    }
    this.current_line--;
    this.created_lines--;
    this.updatePipe();
  }
};

Editor.prototype.updatePipe = function() {
  this.textData = this.textos[this.current_line].text;
  this.pipe.x = this.textos[this.current_line].x + this.textos[this.current_line].width;
  this.pipe.y = (this.y+(this.current_line*this.hLinea));
};

Editor.prototype.setText = function(valor) {
  this.textData += valor;
  this.textos[this.current_line].setText(this.textData);
};

Editor.prototype.validaTexto = function() {
  var length = this.textos[this.current_line].text.length;
  var texto_valida = this.textos[this.current_line].text.substring(this.textos[this.current_line].ult_tinta,length);
  switch(this.textos[this.current_line].cont_string){
    case 0://Ingreso de texto normal (no cadena)
      if(this.textos[this.current_line].text[length-1] == "\"" || this.textos[this.current_line].text[length-1] == "'"){//Se validan apertura de cadena
        this.textos[this.current_line].tipo_string = this.textos[this.current_line].text[length-1];
        this.textos[this.current_line].cont_string=1;
        this.textos[this.current_line].addColor(this.fills.cadena,length-1);
        console.log(this.textos[this.current_line].tipo_string);
      }else if(this.reservados.test(texto_valida)){//Se validan palabras reservadas
        for(var i=length;i>=this.textos[this.current_line].ult_tinta;i--){
          if(this.textos[this.current_line].text[i] == ' '){
            this.textos[this.current_line].addColor(this.fills.reservado,i+1);
            this.textos[this.current_line].ult_tinta = length;
            this.textos[this.current_line].addColor(this.fills.normal,length);
            continue;
          }
        }
      }
      break;
    case 1://En caso de encontrarse dentro de cadena
      console.log(this.textos[this.current_line].tipo_string+" - "+texto_valida);
      if(this.textos[this.current_line].text[length-1] == this.textos[this.current_line].tipo_string){//Se valida el cierre de cadena
        console.log("sale cadena");
        this.textos[this.current_line].cont_string = 0;
        this.textos[this.current_line].addColor(this.fills.normal,length);
        this.textos[this.current_line].ult_tinta = length;
      }
      break;
  }
  
};

Editor.prototype.seleccionar = function() {

	this.seleccionado = true;
};

Editor.prototype.keyPress = function(data) {
    if(this.seleccionado) {
      var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
      console.log(this.current_line + " - " + charCode);
      data.preventDefault();
      switch(data.keyCode) {
        case 8://En caso de ser la tecla borrar
          if(this.textData.length > 1){
            this.textData = this.textData.substring(0, this.textData.length - 1);
            this.textos[this.current_line].setText(this.textData);
          }else{
            this.borrarLinea();
          }
          break;
        case 9://En caso de tabulacion
          this.setText('  ');
          break;
        case 13://En caso de ser la tecla enter se crea una nueva linea
          this.crearLinea();
          break;
        case 16://En caso de ser la tecla shift
          this.shift = true;
          break;
        case 37://Flecha izquierda

          break;
        case 38://Flecha arriba
          if(this.current_line > 0){
            this.current_line--;
            this.updatePipe();
          }
          break;
        case 39://Flecha derecha

          break;
        case 40://Flecha abajo
          if(this.current_line + 1 < this.created_lines){
            this.current_line++;
            this.updatePipe();
          }
          break;
        case 48://En caso de ser la tecla numero 0
          if(this.shift){
            this.setText('=');
          }else{
            this.setText('0');
          }
          break;
        case 50://En caso de ser la tecla numero 2
          if(this.shift){
            this.setText('\"');
          }else{
            this.setText('2');
          }
          break;
        case 56://En case de ser la tecla numero 8
          if(this.shift){
            this.setText('(');
          }else{
            this.setText('8');
          }
          break;
        case 57://En case de ser la tecla numero 8
          if(this.shift){
            this.setText(')');
          }else{
            this.setText('9');
          }
          break;
        case 188://Tecla para comas (,)
          if(this.shift){
            this.setText(';');
          }else{
            this.setText(',');
          }
          break;
        case 190://Tecla para puntos (.,:)
          if(this.shift){
            this.setText(':');
          }else{
            this.setText('.');
          }
          break;
        case 191://Tecla para cierre de corchetes
          if(this.shift){
            this.setText(']');
          }else{
            this.setText('}');
          }
          break;
        case 222://Tecla para apretura corchetes
          if(this.shift){
            this.setText('[');
          }else{
            this.setText('{');
          }
          break;
        case 226://Tecla para < , >
          if(this.shift){
            this.setText('>');
          }else{
            this.setText('<');
          }
          break;
        default:
          var letra = String.fromCharCode((96 <= charCode && charCode <= 105)? charCode-48 : charCode).toLowerCase();
          if (letra.length > 0) {
            this.setText(letra);
          }
          break;
      }
      this.updatePipe();
    }
};

Editor.prototype.keyUp = function(data) {
  if(this.seleccionado){
    var charCode = (typeof data.which == "number") ? data.which : data.keyCode;
    switch(data.keyCode) {
      case 16://En caso de ser la tecla shift
        this.shift = false;
        break;
      default://Se realiza el llamado para validacion de textos
        this.validaTexto();
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