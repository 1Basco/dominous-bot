type GameData = {
  jogador: number;
  mesa: Array<string>;
  mao: Array<string>;
  jogadas: Array<{
    pedra: string;
    lado?: string;
    jogador: number;
  }>;
};

export default function decidePlay(gameData: GameData) {
  if (gameData.mesa.length === 0) {
    return getHighestValueInHand(gameData.mao);
  }
  const picks = getHandAllPossiblePicks(gameData);
  const pick = getHighestValuePick(picks);

  return pick ?? {};
}

function getTableSides(table: Array<String>) {
  if (table.length === 1) {
    return {
      first: table[0],
      last: table[0],
    };
  }
  const first = table.shift();
  const last = table.pop();

  return {
    first,
    last,
  };
}

function getHandAllPossiblePicks(gameData: GameData) {
  const sides = getTableSides(gameData.mesa);

  const picks: ({ pedra: string; lado: string } | undefined)[] = gameData.mao
    .map((piece: string) => {
      /*@ts-ignore*/
      const rigthSide = sides.first[0];
      /*@ts-ignore*/
      const leftSide = sides.last[2];

      if (piece[0] === rigthSide || piece[2] === rigthSide) {
        return {
          pedra: piece,
          lado: "esquerda",
        };
      }

      if (piece[0] === leftSide || piece[2] === leftSide) {
        return {
          pedra: piece,
          lado: "direita",
        };
      }

      return;
    })
    .filter((pick: any) => pick !== undefined);
  return picks;
}

function getHighestValuePick(
  picks: ({ pedra: string; lado: string } | undefined)[]
) {
  const bucha: {
    pedra: string;
    lado: string;
  } | null = getBucha(picks);
  if (bucha !== null) {
    return {
      pedra: bucha.pedra,
      lado: bucha.lado,
    };
  }
  const picksWithValue = picks.map((pick: any) => ({
    pedra: pick.pedra,
    value: parseInt(pick.pedra[0]) + parseInt(pick.pedra[2]),
    lado: pick.lado,
  }));

  const highestValuePicks = picksWithValue.sort(
    (a: any, b: any) => a.value - b.value
  );

  if (highestValuePicks.length === 0) {
    return;
  }
  return {
    pedra: highestValuePicks[0].pedra,
    lado: highestValuePicks[0].lado,
  };
}

function getBucha(picks: ({ pedra: string; lado: string } | undefined)[]) {
  const buchas: ({ pedra: string; lado: string } | undefined)[] = [];

  picks.forEach((pick) => {
    pick?.pedra[0] === pick?.pedra[2] ? buchas.push(pick) : null;
  });

  const picksWithValue = buchas.map((pick: any) => ({
    pedra: pick.pedra,
    value: parseInt(pick.pedra[0]) + parseInt(pick.pedra[2]),
    lado: pick.lado,
  }));

  const highestValuePicks = picksWithValue.sort(
    (a: any, b: any) => b.value - a.value
  );

  if (highestValuePicks.length === 0) {
    console.log("sem bucha");
    return null;
  }
  return {
    pedra: highestValuePicks[0].pedra,
    lado: highestValuePicks[0].lado,
  };
}

function getHighestValueInHand(mao: Array<string>) {
  const maxValue = Math.max(
    ...mao.map((pick: any) => parseInt(pick[0]) + parseInt(pick[2]))
  );
  const highestValuePicks = mao.filter(
    (pick: any) => parseInt(pick[0]) + parseInt(pick[2]) === maxValue
  );

  return {
    pedra: highestValuePicks[0],
  };
}
