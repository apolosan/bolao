const fs = require("fs");

const TESTAR = false;

// Forma a lista de numeros desejada
const formarNumeros = (numeros = []) => {
  // const numeros = [];
  for (let i = 0; i < 60; i++) {
    if (numeros.indexOf(i + 1) < 0) numeros.push(i + 1);
  }
  return numeros;
};

// Constroi os grupos com base na lista de numeros informada
const formarGruposDeNumeros = (numeros, qtdeDeGrupos) => {
  const grupos = [];
  const selecionadosParaGrupo = [];
  const qtdeMinimaPorGrupo = Math.floor(numeros.length / qtdeDeGrupos);
  // Forma os grupos estabelecidos;
  for (let i = 0; i < qtdeDeGrupos; i++) {
    const grupoAtual = [];
    while (grupoAtual.length < qtdeMinimaPorGrupo) {
      const numero = parseInt(Math.random() * numeros.length) + 1;
      if (selecionadosParaGrupo.indexOf(numero) < 0) {
        grupoAtual.push(numero);
        selecionadosParaGrupo.push(numero);
      }
    }
    grupos.push(grupoAtual);
  }
  // Certifica de que todos os numeros foram selecionados e incluidos em um grupo
  for (let i = 0; i < numeros.length; i++) {
    const numero = numeros[i];
    if (selecionadosParaGrupo.indexOf(numero) < 0) {
      const indiceGrupo = parseInt(Math.random() * qtdeDeGrupos);
      grupos[indiceGrupo].push(numero);
      selecionadosParaGrupo.push(numero);
    }
  }
  return grupos;
};

// Testa condicoes dos grupos formados:
// 1. Todos os numeros devem ser contemplados
// 2. Cada numero deve pertencer a, no minimo e no maximo, 1 grupo
const testarCondicaoDeGrupos = (numeros, grupos) => {
  if (TESTAR) {
    const tamanho = grupos.length;
    const qtdeDeTestes = 100000;
    for (let teste = 0; teste < qtdeDeTestes; teste++) {
      for (let indexNumero = 0; indexNumero < numeros.length; indexNumero++) {
        let visto = 0;
        for (let indexGrupo = 0; indexGrupo < tamanho; indexGrupo++) {
          if (grupos[indexGrupo].indexOf(numeros[indexNumero]) >= 0) visto++;
        }
        if (visto != 1) return false;
      }
    }
  }
  return true;
};

// Constroi um jogo individual
const constroiJogo = (numeros, jogos, numerosSelecionados, qtdeDeGrupos) => {
  const grupos = formarGruposDeNumeros(numeros, qtdeDeGrupos);
  if (testarCondicaoDeGrupos(numeros, grupos)) {
    const jogo = [];
    while (jogo.length < qtdeDeGrupos) {
      for (let i = 0; i < grupos.length; i++) {
        const numero = grupos[i][parseInt(Math.random() * grupos[i].length)];
        if (numerosSelecionados.indexOf(numero) < 0) {
          jogo.push(numero);
          numerosSelecionados.push(numero);
          if (jogo.length >= qtdeDeGrupos) break;
        }
      }
      if (jogo.length >= qtdeDeGrupos) break;
    }
    jogos.push(jogo);
    return [jogos, numerosSelecionados];
  } else {
    return [[], []];
  }
};

// Retira os numeros jogados da lista de proximos numeros a serem selecionados para um novo jogo
const removerNumerosSelecionados = (numeros, numerosSelecionados) => {
  let novosNumeros = numeros;
  for (let i = 0; i < numerosSelecionados.length; i++) {
    const indiceDoNumero = novosNumeros.indexOf(numerosSelecionados[i]);
    if (indiceDoNumero >= 0) {
      novosNumeros = novosNumeros
        .slice(0, indiceDoNumero)
        .concat(novosNumeros.slice(indiceDoNumero + 1));
    }
  }
  return novosNumeros;
};

const construirJogoGenerico = (tiposDeJogos, qtdeDeJogos) => {
  let numeros = formarNumeros();
  let numerosSelecionados = [];
  let jogos = [];
  if (qtdeDeJogos.length != tiposDeJogos.length) {
    return [];
  } else {
    for (let i = 0; i < tiposDeJogos.length; i++) {
      for (let j = 0; j < qtdeDeJogos[i]; j++) {
        if (numeros.length < tiposDeJogos[i]) {
          numeros = formarNumeros();
          numerosSelecionados = [];
        }
        [jogos, numerosSelecionados] = constroiJogo(
          numeros,
          jogos,
          numerosSelecionados,
          tiposDeJogos[i]
        );
        numeros = removerNumerosSelecionados(numeros, numerosSelecionados);
      }
    }
  }
  let conteudoResultado;
  // console.log("BOLAO DA SETI - JOGOS: ");
  conteudoResultado = "BOLAO DA SETI - JOGOS: \n";
  // console.log("------------------------------------------------------------------------");
  conteudoResultado +=
    "------------------------------------------------------------------------\n";
  for (let i = 0; i < jogos.length; i++) {
    // console.log(`JOGO #${i + 1} - ${jogos[i].length} NUMEROS: `);
    conteudoResultado += `JOGO #${i + 1} - ${jogos[i].length} NUMEROS: `;
    let resultado = "- ";
    conteudoResultado += "- ";
    for (let j = 0; j < jogos[i].length; j++) {
      resultado += jogos[i][j] + " - ";
      conteudoResultado += jogos[i][j] + " - ";
    }
    // console.log(resultado);
    // console.log("------------------------------------------------------------------------");
    conteudoResultado +=
      "\n------------------------------------------------------------------------\n";
  }
  fs.writeFileSync("jogos.txt", conteudoResultado);
};

const construirJogoTradicional = () => {
  let numeros = formarNumeros();
  let numerosSelecionados = [];
  let jogos = [];
  for (let i = 0; i < 10; i++) {
    [jogos, numerosSelecionados] = constroiJogo(
      numeros,
      jogos,
      numerosSelecionados,
      6
    );
    numeros = removerNumerosSelecionados(numeros, numerosSelecionados);
  }
  console.log("JOGOS MONTADOS: ");
  console.log(jogos);
  console.log("NUMEROS RESTANTES: ");
  console.log(numeros);
  console.log("NUMEROS SELECIONADOS: ");
  console.log(numerosSelecionados);
};

construirJogoGenerico([8, 7, 6], [1, 3, 4]);
