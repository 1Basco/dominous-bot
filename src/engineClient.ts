import { edenTreaty } from "@elysiajs/eden";
import { App } from ".";
import DominoGameEngine from "./engine";

const app = edenTreaty<App>("http://localhost:8000");
// response type: { id: 1895, name: 'Skadi' }
// const { data, error } = app.index
//   .post({
//     jogador: 3,
//     mao: ["3-6", "5-5", "1-2", "0-0", "0-4", "1-6"],
//     mesa: ["1-6", "6-6", "6-4", "4-4"],
//     jogadas: [
//       {
//         jogador: 3,
//         pedra: "6-6",
//       },
//       {
//         jogador: 4,
//         pedra: "6-4",
//         lado: "direita",
//       },
//       {
//         jogador: 1,
//         pedra: "4-4",
//         lado: "direita",
//       },
//       {
//         jogador: 2,
//         pedra: "1-6",
//         lado: "esquerda",
//       },
//     ],
//   })
//   .then((response: any) => {
//     console.log(response.data);
//   });

const game = new DominoGameEngine();
function handleGame(back?: any) {
  const estado = game.getEstadoAtual();
  const jogador = estado.jogadores[estado.jogadas.length % 4].id;
  if (back) {
    if (checkIfGameIsOver()) return;
    console.log("pedra escolhida pelo bot: ", back.data.pedra);
    if (!back.data.lado) {
      game.realizarJogada(jogador, back.data.pedra);
    } else {
      game.realizarJogada(jogador, back.data.pedra, back.data.lado);
    }
  }
  const estadoForNextPlayer = game.getEstadoForNextPlayer();
  console.log(estadoForNextPlayer);
  app.index.post(estadoForNextPlayer).then((data: any) => {
    handleGame(data);
  });
  console.log(estado);
  console.log(estadoForNextPlayer);
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
