(function () {
    String.prototype.format = function () {
      if (arguments.length > 0) {
        var tempStr = this,
          i = 0,
          qtd = arguments.length;
                  
        for (; i < qtd; i++) {
          tempStr = tempStr.replace('{' + i + '}', arguments[i]);
        }
              
        return tempStr;
      }
      else {
        return this;
      }
    };
  }());