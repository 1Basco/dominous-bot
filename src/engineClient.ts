import { edenTreaty } from "@elysiajs/eden";
import { App } from ".";
import DominoGameEngine from "./engine";

type TNewPlay = {
  data: {
    pedra: string;
    lado?: string;
  };
};

const app: any = edenTreaty<App>("http://localhost:8000");

const game = new DominoGameEngine();

function handleGame(newPlay?: TNewPlay) {
  const estado = game.getEstadoAtual();
  const jogador = estado.jogadores[estado.jogadas.length % 4].id;
  if (newPlay) {
    if (checkIfGameIsOver()) return;
    if (!newPlay.data.lado) {
      game.realizarJogada(jogador, newPlay.data.pedra);
    } else {
      game.realizarJogada(jogador, newPlay.data.pedra, newPlay.data.lado);
    }
  }
  const estadoForNextPlayer = game.getEstadoForNextPlayer();
  app.index.post(estadoForNextPlayer).then((data: any) => {
    handleGame(data);
  });

  console.log(estado.mesa);
}

function checkIfGameIsOver() {
  // if any player has no more pieces, the game is over
  const estado = game.getEstadoAtual();
  if (estado.jogadores.some((jogador) => jogador.mao.length === 0)) {
    console.log("Jogo encerrado");
    // say who won the game
    const winner = estado.jogadores.find((jogador) => jogador.mao.length === 0);
    if (winner) {
      console.log(`Vencedor: Jogador ${winner.id}`);
      console.log("Mão player 1: ", estado.jogadores[0].mao);
      console.log("Mão player 2: ", estado.jogadores[1].mao);
      console.log("Mão player 3: ", estado.jogadores[2].mao);
      console.log("Mão player 4: ", estado.jogadores[3].mao);
    }
    return true;
  }
  // if the last four jogadas are all passou, the game is over
  if (
    estado.jogadas.length >= 4 &&
    estado.jogadas.slice(-4).every((jogada) => jogada.pedra === "passou")
  ) {
    console.log("Jogo encerrado");
    console.log("Mesa fechou");
    console.log("Mão player 1: ", estado.jogadores[0].mao);
    console.log("Mão player 2: ", estado.jogadores[1].mao);
    console.log("Mão player 3: ", estado.jogadores[2].mao);
    console.log("Mão player 4: ", estado.jogadores[3].mao);
    return true;
  }
}

handleGame();
