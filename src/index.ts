import { Elysia, t } from "elysia";
import figlet from "figlet";
import decidePlay from "./bot";

const app = new Elysia();

app
  .post(
    "/",
    ({ body }) => {
      return decidePlay(body);
    },
    {
      body: t.Object({
        jogador: t.Number(),
        mao: t.Array(t.String()),
        mesa: t.Array(t.String()),
        jogadas: t.Array(
          t.Object({
            jogador: t.Number(),
            pedra: t.String(),
          })
        ),
      }),
    }
  )
  .listen(8000);

export type App = typeof app;

const initText = figlet.textSync("Dominous BOT");

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}
    ${initText}
  `
);
