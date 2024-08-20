(function (document) {

    var gansoSelecionado = null,
      posicaoRaposa = null,
      turno = 1, // 0 = Ganso, 1 = Raposa
      seletor = 'section input[id="{0}_{1}"]',
  
      // Atualiza informacoes da tela sobre as jogadas
      informacoes = {
        turno: {
          atualizar: function () {
            var controle = document.getElementById('info_turno');
            if (turno === 0) {
              controle.innerText = 'Gansos';
              controle.className = '';
            }
            else {
              controle.innerText = 'Raposa';
              controle.className = 'raposa';
            }
          }
        },
        gansos: {
          quantidade: 13,
          matar: function () {
            document.getElementById('qtd_gansos').innerText = --this.quantidade;
          }
        },
        jogadas: {
          gansos: {
            quantidade: 0,
            adicionar: function () {
              document.getElementById('total_ganso').innerText = ++this.quantidade;
            }
          },
          raposa: {
            quantidade: 0,
            adicionar: function () {
              document.getElementById('total_raposa').innerText = ++this.quantidade;
            }
          }
        }
      };
  
    // Obtem a coordenada através do id
    var obtemCoordenada = function (id) {
      if (id !== '') {
        var coordenadas = id.split('_');
        return {
          x: parseInt(coordenadas[0]),
          y: parseInt(coordenadas[1])
        };
      }
    };
  
    // Verifica movimentos para comer gansos
    var verificaPassosComer = function (posicaoPartida, movimentos) {
      var i = 0,
        proximo = null,
        movimentosComer = [],
        qtd = movimentos.length;
      for (; i < qtd; i++) {
        if (movimentos[i]) {
          if (movimentos[i].classList.contains('ganso')) {
            // Verifica se o espaço após o ganso está vazio, possibilitando comer o ganso
            var coordenada = obtemCoordenada(movimentos[i].id),
              movimento = {
                x: false,
                    y: false,
                    valor: 0
              };
            if (coordenada.x < posicaoPartida.x) {
              // Norte
              movimento.x = true;
              movimento.valor = -1;
            }
            else if (coordenada.x > posicaoPartida.x) {
              // Sul
              movimento.x = true;
              movimento.valor = 1;
            }
            else if (coordenada.y > posicaoPartida.y) {
              // Leste
              movimento.y = true;
              movimento.valor = 1;
            }
            else if (coordenada.y < posicaoPartida.y) {
              // Oeste
              movimento.y = true;
              movimento.valor = -1;
            }
  
                // Indica se o proximo pulo precisa ser em ganso ou em espaco vazio
            var precisaSerGanso = false,
              ultimosGansos = [
                movimentos[i]
              ];
  
            for (var x = 0; x < 5; x++) {
              // Verifica para qual lado é o movimento
              if (movimento.x) {
                proximo = document.querySelector(seletor.format((coordenada.x + movimento.valor), posicaoPartida.y));
              }
              else {
                proximo = document.querySelector(seletor.format(posicaoPartida.x, (coordenada.y + movimento.valor)));
              }
  
              if (proximo !== null) {
                if (precisaSerGanso) {
                  if (!proximo.classList.contains('ganso')) {
                    proximo = null;
                    break;
                  }
                  precisaSerGanso = false;
                  ultimosGansos.push(proximo);
                }
                else {
                  if (proximo.classList.contains('ganso')) {
                    proximo = null;
                    break;
                  }
                  precisaSerGanso = true;
  
                  if (ultimosGansos.length > 0) {
                    var dataCoordenadas = '';
                    for (var z = 0; z < ultimosGansos.length; z++) {
                      var coordenadaGansoMorto = obtemCoordenada(ultimosGansos[z].id);
                      if (z > 0) {
                        dataCoordenadas += ';';
                      }
                      dataCoordenadas += coordenadaGansoMorto.x + '_' + coordenadaGansoMorto.y;
                    }
                    proximo.dataset.gansoMorto = dataCoordenadas;
                  }
                }
  
                      // Aumenta o valor para onde será o pulo
                if (movimento.valor > 0) {
                  movimento.valor++;
                }
                else {
                  movimento.valor--;
                }
  
                      // Adiciona esse movimento como possivel caso todas as condicoes forem obedecidas
                if (proximo !== null && !proximo.classList.contains('ganso')) {
                        movimentosComer.push(proximo);
                }
  
                proximo = null;
              }
              else {
                break;
              }
                }
  
            // Deixa movimento nulo pois ele é um ganso
            movimentos[i] = null;
          }
        }
      }
  
      return movimentos.concat(movimentosComer);
    };
  
      // Função para verificar todos os movimentos possíveis para a raposa ou ganso selecionado
    var obtemPassosPossiveis = function (posicao) {
      var seletorTemp = seletor;
      if (!turno) {
        seletorTemp += ':not(.ganso):not(.raposa)';
      }
  
      var movimentosProximos = [
        // Norte
        document.querySelector(seletorTemp.format((posicao.x - 1), posicao.y)),
        // Sul
        document.querySelector(seletorTemp.format((posicao.x + 1), posicao.y)),
        // Leste
        document.querySelector(seletorTemp.format(posicao.x, (posicao.y + 1))),
        //Oeste
        document.querySelector(seletorTemp.format(posicao.x, (posicao.y - 1)))
      ];
  
      // Verifica se algum dos passos é um ganso, somente para raposa
      if (turno) {
        movimentosProximos = verificaPassosComer(posicao, movimentosProximos);
      }
  
      return movimentosProximos;
    };
  
    // Mostra os movimentos possíveis alterando o layout das peças
    var exibirPecasJogaveis = function (posicaoPartida) {
      var passos = obtemPassosPossiveis(posicaoPartida),
        possuiMovimentos = false;
      if (posicaoPartida.x > -1 && posicaoPartida.y > -1) {
        // Obtem todos os espaços vazios próximos
        var i = 0
          qtd = passos.length;
        for (; i < qtd; i++) {
          if (passos[i] !== null) {
            document.getElementById(passos[i].id).classList.add('jogavel');
            possuiMovimentos = true;
          }
        }
      }
  
      if (!possuiMovimentos && turno === 1) {
        mostrarModal('Vitória dos gansos!', 'Parabéns gansos, a vitória é sua!', function () {
          window.location.reload();
        });
        return;
      }
    };
  
    // Remove a classe de todos os elementos que a possuem
    var removerClasses = function (classe) {
      var seletor = 'section .' + classe,
        elementos = document.querySelectorAll(seletor);
      if (elementos !== null && elementos.length > 0) {
        var i = 0,
          qtd = elementos.length;
  
        for (; i < qtd; i++) {
          if (elementos[i] !== undefined) {
            elementos[i].classList.remove(classe);
          }
        }
      }
    };
  
    // Inclui ou remove classe da peça selecionada
    var selecionaPeca = function (id, selecionar) {
      if (selecionar) {
        document.getElementById(id).classList.add('selecionado');
      }
      else {
        document.getElementById(id).classList.remove('selecionado');
      }
    };
  
    // Remove o atributo data-ganso-morto de todas as pecas
    var removerDataGansoMorto = function () {
      var pecas = document.querySelectorAll('section input[data-ganso-morto]');
      if (pecas && pecas.length > 0) {
        for (var i = 0; i < pecas.length; i++) {
          delete pecas[i].dataset.gansoMorto;
        };
      }
    };
  
    // Remove os gansos mortos
    var removerGansosMortos = function (strGansosMortos) {
      if (strGansosMortos && strGansosMortos !== '') {
        var pecas = strGansosMortos.split(';');
        if (pecas.length > 0) {
          for (var i = 0; i < pecas.length; i++) {
            document.getElementById(pecas[i]).classList.remove('ganso');
            informacoes.gansos.matar();
          }
        }
      }
    };
  
    // Verifica a quantidade de gansos no jogo, se essa quantidade for menor ou igual a 3, o jogador com os gansos perde
    var verificaGansos = function () {
      var gansos = document.querySelectorAll('.ganso');
      if (gansos.length <= 3) {
        return false;
      }
      return true;
    };
  
    // Evento de clique no body
    document.body.addEventListener('click', function (e) {
      var target = e.target;
      if (target !== null && target.nodeName === 'INPUT') {
        if (!posicaoRaposa && !target.classList.contains('ganso')) {
          // É o posicionamento da raposa
          target.classList.add('raposa');
          posicaoRaposa = obtemCoordenada(target.id);
          turno = 0; // Tranforma no turno dos gansos
        }
        else if (turno && target.classList.contains('jogavel')) {
          // Turno da raposa
  
          // Remove alguma peca que seja jogável
          removerClasses('jogavel');
  
          target.classList.add('raposa');
  
          document.getElementById(posicaoRaposa.x + '_' + posicaoRaposa.y).classList.remove('raposa');
          posicaoRaposa = obtemCoordenada(target.id);
  
          // Remover gansos mortos
          removerGansosMortos(target.dataset.gansoMorto);
  
          // Muda para turno dos gansos
          turno = 0;
  
          // Remove todos os atributos data-ganso-morto
          removerDataGansoMorto();
  
          informacoes.jogadas.raposa.adicionar();
        }
        else if(!turno && target.classList.contains('ganso')) {
          // Turno dos gansos
  
          // Remove alguma peca que esteja selecionada ou que seja jogável
          removerClasses('selecionado');
          removerClasses('jogavel');
  
          // Seleciona o ganso que foi clicado
          selecionaPeca(target.id, true);
          gansoSelecionado = obtemCoordenada(target.id);
  
          // Seleciona os jogáveis atuais
          exibirPecasJogaveis(gansoSelecionado);
        }
        else if (!turno && target.classList.contains('jogavel')) {
          // Peca para onde o ganso sera movido
  
          // Remove alguma peca que esteja selecionada ou que seja jogável
          removerClasses('selecionado');
          removerClasses('jogavel');
  
          target.classList.add('ganso');
  
          document.getElementById(gansoSelecionado.x + '_' + gansoSelecionado.y).classList.remove('ganso');
          gansoSelecionado = null;
  
          // Muda para turno da raposa
          turno = 1;
          exibirPecasJogaveis(posicaoRaposa);
  
          informacoes.jogadas.gansos.adicionar();
        }
  
        if (!verificaGansos()) {
          mostrarModal('Vitória da raposa!', 'Parabéns raposa, a vitória é sua!', function () {
            window.location.reload();
          });
          return;
        }
  
        informacoes.turno.atualizar();
      }
    });
  
    // Clique do botao para exibir e esconder a legenda
    document.getElementById('mostrar_legenda').addEventListener('click', function () {
      var legenda = document.querySelector('.legenda');
      if (legenda) {
        if (legenda.classList.contains('aberta')) {
          legenda.classList.remove('aberta');
        }
        else {
          legenda.classList.add('aberta');
        }
      }
      return false;
    });
  
    // Timer para esconder a legenda apos tempo estipulado. Serve para orientar os jogadores ao inicio da partida
    window.setTimeout(function () {
      document.getElementById('mostrar_legenda').click();
    }, 5000);
  
  }(document));
  