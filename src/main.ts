import { Game } from "./components";
import "./style.css";
import { createScoreHistory } from "./utils/score";

async function initializeGame() {
  new Game();
  await new Promise((resolve) => window.onload = resolve);
  createScoreHistory();
}

initializeGame();
