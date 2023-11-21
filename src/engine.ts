export default class DominoGameEngine {
  private state: {
    jogadores: {
      id: number;
      mao: string[];
    }[];
    mesa: string[];
    jogadas: {
      jogador: number;
      pedra: string;
      lado?: string;
    }[];
  };

  constructor() {
    this.state = {
      jogadores: [
        { id: 1, mao: [] },
        { id: 2, mao: [] },
        { id: 3, mao: [] },
        { id: 4, mao: [] },
      ],
      mesa: [],
      jogadas: [],
    };

    this.distribuirPecas();
  }

  private distribuirPecas() {
    const todasAsPecas = this.gerarTodasAsPecas();
    todasAsPecas.sort(() => Math.random() - 0.5); // Embaralhar as peças

    this.state.jogadores.forEach((jogador) => {
      jogador.mao = todasAsPecas.splice(0, 6); // Distribuir 6 peças para cada jogador
    });
  }

  private gerarTodasAsPecas() {
    const todasAsPecas = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        todasAsPecas.push(`${i}-${j}`);
      }
    }
    return todasAsPecas;
  }

  public realizarJogada(jogador: number, pedra: string, lado?: string) {
    if (pedra === undefined && lado === undefined) {
      this.state.jogadas.push({ jogador, pedra: "passou" });
      return this.state;
    }
    if (jogador !== (this.state.jogadas.length % 4) + 1) {
      throw new Error("Não é turno do jogador atual");
    }

    if (!this.validarJogada(pedra, lado)) {
      throw new Error("Jogada inválida");
    }

    if (this.state.jogadores[jogador - 1].mao.indexOf(pedra) === -1) {
      throw new Error("Jogador não tem essa pedra");
    }

    const jogadorAtual = this.state.jogadores.find((j) => j.id === jogador);

    if (jogadorAtual) {
      jogadorAtual.mao.splice(jogadorAtual.mao.indexOf(pedra), 1);
      if (lado === "esquerda") {
        this.state.mesa.unshift(this.flipIfNeeded(pedra, lado));
      } else if (lado === "direita") {
        this.state.mesa.push(this.flipIfNeeded(pedra, lado));
      } else {
        this.state.mesa.push(pedra);
      }
      if (this.state.jogadas.length === 0) {
        this.state.jogadas.push({ jogador, pedra });
      } else {
        this.state.jogadas.push({ jogador, pedra, lado });
      }
    }

    return this.state;
  }

  private flipIfNeeded(pedra: string, lado: string) {
    if (lado === "esquerda" && pedra[0] == this.state.mesa[0][0]) {
      return this.flipPedra(pedra);
    }
    if (
      lado === "direita" &&
      pedra[2] == this.state.mesa[this.state.mesa.length - 1][2]
    ) {
      return this.flipPedra(pedra);
    }
    return pedra;
  }

  private flipPedra(pedra: string) {
    return pedra.split("-").reverse().join("-");
  }

  private validarJogada(pedra: string, lado?: string) {
    // Lógica para validar se a jogada é válida
    // ...

    return true; // Adapte conforme necessário
  }

  public getEstadoAtual() {
    return this.state;
  }

  public getEstadoForNextPlayer() {
    return {
      mesa: this.state.mesa,
      jogadas: this.state.jogadas,
      mao: this.state.jogadores[this.state.jogadas.length % 4].mao,
      jogador: this.state.jogadores[this.state.jogadas.length % 4].id,
    };
  }
}
