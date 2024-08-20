var mostrarModal = function (titulo, mensagem, callback) {
    if (titulo && mensagem) {
      var elementoTitulo = document.querySelector('#modal .titulo h1'),
        elementoMensagem = document.querySelector('#modal #mensagem'),
        botaoFechar = document.querySelector('#modal .fechar');
  
      if (elementoTitulo && elementoMensagem && botaoFechar) {
        elementoTitulo.innerText = titulo;
        elementoMensagem.innerText = mensagem;
  
        botaoFechar.removeEventListener('click');
        botaoFechar.addEventListener('click', function () {
          document.getElementById('modal').className = '';
          document.getElementById('overlay').className = '';
  
          if (callback) {
            callback();
          }
  
          return false;
        });
  
        document.getElementById('modal').className = 'aberta';
        document.getElementById('overlay').className = 'aberta';
      }
    }
  };
  