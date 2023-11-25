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

  if (picks.length > 0) {
    const counts = countNumbers(picks, gameData.mesa);
    const scores = calculateScores(picks, counts);
    return {
      pedra: scores[0].piece.pedra,
      lado: scores[0].piece.lado,
    };
  }

  return {};
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

function countNumbers(
  picks: Array<{ pedra: string; lado: string } | undefined>,
  table: Array<string>
): Record<string, number> {
  const counts: Record<string, number> = {};
  [...picks, ...table].flat().forEach((num: string | { pedra: string }) => {
    if (typeof num === "string") {
      counts[num[0]] = (counts[num[0]] || 0) + 1;
      counts[num[2]] = (counts[num[2]] || 0) + 1;
    } else {
      counts[num.pedra[0]] = (counts[num.pedra[0]] || 0) + 1;
      counts[num.pedra[2]] = (counts[num.pedra[2]] || 0) + 1;
    }
  });
  return counts;
}

function calculateScores(
  possiblePicks: Array<{ pedra: string; lado: string }>,
  counts: Record<string, number>
) {
  const scores = possiblePicks.map((piece: any) => {
    const score = counts[piece.pedra[0]] + counts[piece.pedra[2]];
    return { piece, score };
  });
  return scores.sort((a: any, b: any) => b.score - a.score);
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
