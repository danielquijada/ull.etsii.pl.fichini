"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
   $("#fileinput").change(calculate);
});
//main
function calculate(evt) {
  var f = evt.target.files[0]; 

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      
      out.className = 'unhidden';
      initialinput.value = contents;
      finaloutput.value = pretty;
    }
    r.readAsText(f); // Leer como texto
  } else { 
    alert("Failed to load file");
  }
}

var temp = '<li> <span class = "<%= token.type %>"> <%= matching %> </span>\n';

function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(temp, {token: t, matching: s});     
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
  var blanks         = /^\s+/g;
  var iniheader      = /^\[.+\]/;
  var comments       = /^[;#].*/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var any            = /^(.|n)+/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      out.push({ type : input, match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      input.lastIndex;// avanzemos en input
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      input.lastIndex;// avanzemos en input
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m.lastIndex);
      input.lastIndex;// avanzemos en input
    }
    else if (m = any.exec(input)) {
      input.lastIndex;// avanzemos en input
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}