'use strict';

var Editor = function(game, x, y ,width , lines, parent){
  Phaser.Group.call(this, game, parent);

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.seleccionado = true;
  this.shift = false;//Control tecla shift
  this.hLinea = 14;//Tamaño de fuente 
  this.ancho = width;
  this.heigth = lines * this.hLinea;//Alto del editor
  this.created_lines = 0;//Lineas creadas
  this.current_line = 0;//Linea actual
  this.margen = 20;//Margen izquierda para texto de codigo
  this.lineas = new Array();//Array para control numero de lineas
  this.textos = new Array();//Array para control de textos por linea
  this.fills = {normal: "#fff",editor: "#666",cadena: "#988927", reservado: "#c92246", reservado2: "#2FC687"};//Tipo de color de fuente
  this.font = { font: this.hLinea+'px consolas', fill: this.fills.normal, align:'center'};//Fuente unica para el editor
  this.reservados = /(\s|})(if|else|for|while|switch|case|break)/ig;
  this.reservados2 = /(\s)(function|var)/ig;
  this.textData = ' ';//String para control de textos ingresados
  
  //Se dibuja la caja de texto
  this.cajaTexto = game.add.graphics( 0, 0 );
  this.cajaTexto.beginFill(0x272822, 1);
  this.cajaTexto.bounds = new PIXI.Rectangle(x, y, width, this.heigth);
  this.cajaTexto.drawRect(x, y, width, this.heigth);
  this.add(this.cajaTexto);
  
  //Se agrega el primer número de linea
  this.crearLinea();
  //Se realiza la creacion del pipe ( | )
  this.pipe = this.game.add.text((this.x+this.margen) ,(this.y+(this.current_line*this.hLinea)),'|',this.font);
  this.pipe.xPos = 1;//Posicion del pipe sobre la linea horizontal
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

Editor.prototype.setTint = function(tinta,posicion) {
  //this.textos[this.current_line].addColor(tinta,i+1);//Se define fuente para palabras reservadas
  //this.textos[this.current_line].ult_tinta = length;//Se stea la ultima posicion de color
  //this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
};

Editor.prototype.validaTexto = function() {
  var length = this.textos[this.current_line].text.length;
  if(length == 1){
    this.textos[this.current_line].cont_string = 0;
    this.textos[this.current_line].ult_tinta = 0;
    this.textos[this.current_line].clearColors();
  }
  var texto_valida = this.textos[this.current_line].text.substring(this.textos[this.current_line].ult_tinta,length);
  switch(this.textos[this.current_line].cont_string){
    case 0://Ingreso de texto normal (no cadena)
      if(this.textos[this.current_line].text[length-1] == "\"" || this.textos[this.current_line].text[length-1] == "'"){//Se validan apertura de cadena
        this.textos[this.current_line].tipo_string = this.textos[this.current_line].text[length-1];//Se define el tipo de apertura de cadena
        this.textos[this.current_line].cont_string=1;//Se establece el estado de apertura de cadena
        this.textos[this.current_line].addColor(this.fills.cadena,length-1);//Se define fuente para cadenas
      }else if(this.reservados.test(texto_valida)){//Se validan palabras reservadas
        for(var i=length;i>=this.textos[this.current_line].ult_tinta;i--){
          if(this.textos[this.current_line].text[i] == ' ' || this.textos[this.current_line].text[i] == '}'){
            this.textos[this.current_line].addColor(this.fills.reservado,i+1);//Se define fuente para palabras reservadas
            this.textos[this.current_line].ult_tinta = length;//Se stea la ultima posicion de color
            this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
            continue;
          }
        }
      }else if(this.reservados2.test(texto_valida)){//Se validan palabras reservadas
        for(var i=length;i>=this.textos[this.current_line].ult_tinta;i--){
          if(this.textos[this.current_line].text[i] == ' '){
            this.textos[this.current_line].addColor(this.fills.reservado2,i+1);//Se define fuente para palabras reservadas
            this.textos[this.current_line].ult_tinta = length;//Se stea la ultima posicion de color
            this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
            continue;
          }
        }
      }
      break;
    case 1://En caso de encontrarse dentro de cadena
      console.log(this.textos[this.current_line].tipo_string+" - "+texto_valida);
      if(this.textos[this.current_line].text[length-1] == this.textos[this.current_line].tipo_string){//Se valida el cierre de cadena
        this.textos[this.current_line].cont_string = 0;//Se retorna el estado
        this.textos[this.current_line].addColor(this.fills.normal,length);//Se define fuente normal
        this.textos[this.current_line].ult_tinta = length;//Se setea la ultima posicion de color
      }
      break;
  }  
};

Editor.prototype.getText = function() {
  var textoRetorno = "";
  for(var i=0;i<this.textos.length;i++){//Se recorren las lineas del editor
    textoRetorno += this.textos[i].text;//Se concatena el texto de cada linea
  }
  return textoRetorno;
};

Editor.prototype.getTextLine = function(line) {
  if(this.textos[line].text){
    return this.textos[line].text;//Se concatena el texto de cada linea
  }else{
    return "error";
  }
};

Editor.prototype.getTextLines = function() {
  //Se retorna el array de textos
  return this.textos;
};

Editor.prototype.showError = function(error,linea) {
  //Se dibuja la caja de error
  if(!this.errorGroup){
    this.errorGroup = this.game.add.group();
    this.errorGroup.alpha = 0;
    this.cajaError = this.game.add.graphics( this.x, ((this.y + this.heigth) - 40) );
    this.cajaError.beginFill(0xdb3a1e, 1);
    this.cajaError.bounds = new PIXI.Rectangle(0, this.heigth, this.ancho, 40);
    this.cajaError.drawRect(0, 0, this.ancho, 40);
    this.errorGroup.add(this.cajaError);
    this.txtError = this.game.add.text(this.cajaError.x+5,this.cajaError.y,'',this.font);
    this.txtError.wordWrap = true;
    this.txtError.wordWrapWidth = this.ancho;
    this.errorGroup.add(this.txtError);
    this.add(this.errorGroup);
  }
  switch(error){
    case "SyntaxError":
      this.txtError.setText('Ups, creo que tienes un error de sintaxis en la linea ' + (linea+1));
      break;
    case "ReferenceError":
      this.txtError.setText('Ups, tal vez el objeto nombrado en la linea ' + (linea+1) + ' no exista');
      break;
    default:
      this.txtError.setText('Ups, '+error+' en la linea ' + (linea+1));
      break;
  }  
  this.game.add.tween(this.errorGroup).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);
};

Editor.prototype.hideError = function(error,linea) {
  if(this.errorGroup){
    this.game.add.tween(this.errorGroup).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  }
}

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
          if(this.pipe.xPos > 1){
            this.pipe.xPos = this.textos[this.current_line].text.length - 1;
          }else{
            if(this.current_line > 0){
              this.current_line--;
              this.pipe.xPos = this.textos[this.current_line].text.length;
            }
          }
          break;
        case 38://Flecha arriba
          if(this.current_line > 0){
            this.current_line--;
          }
          break;
        case 39://Flecha derecha
          if(this.pipe.xPos < this.textos[this.current_line].text.length){
            this.pipe.xPos = this.textos[this.current_line].text.length + 1;
          }else{
            if(this.current_line + 1 < this.created_lines){
              this.current_line++;
              this.pipe.xPos = this.textos[this.current_line].text.length;
            }
          }
          break;
        case 40://Flecha abajo
          if(this.current_line + 1 < this.created_lines){
            this.current_line++;
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
        case 107://En caso de ser +
        case 187:
          this.setText('+');
          break;
        case 109://En caso de ser -
        case 189:
          this.setText('-');
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

Editor.prototype.glow = function(estado,e) {
  switch(estado){
    case true:
      this.glowTween = this.game.add.tween(this.cajaTexto).to({alpha:1.5}, 500, Phaser.Easing.Linear.None, true, 0, 500, true);
      setTimeout(this.glow,3000,false,this);
      break;
    case false:
      if(e){
        e.glowTween.stop();
        e.game.add.tween(e.cajaTexto).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);
      }else{
        if(this.glowTween){
          this.glowTween.stop();
          this.game.add.tween(this.cajaTexto).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);
        }
      }
      break;
  }  
};

Editor.prototype.limpiar = function() {
  for(var i=1;i<this.created_lines;i++){
    this.textos[i].destroy();
  }
  this.textos[0].setText(' ');
  this.current_line=0;
  this.created_lines=1;
  this.updatePipe();
};

Editor.prototype.destruir = function() {
  this.cajaTexto.destroy();
  this.texto.destroy();
  this.seleccionado = false;
  this.destroy();
};

module.exports = Editor;