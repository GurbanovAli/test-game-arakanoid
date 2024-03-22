export const createScoreHistory = () => {
  const scoreHistoryElement = document.getElementById("scoreHistory");
  const scoreHistory = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

  if (scoreHistory.length > 0 && scoreHistoryElement) {
    scoreHistoryElement.innerHTML = "";
    scoreHistory.forEach(
      ({
        playerName,
        playerScore,
      }: {
        playerName: string;
        playerScore: number;
      }) => {
        const scoreItem = document.createElement("div");
        scoreItem.textContent = `${playerName}: ${playerScore} points`;
        scoreHistoryElement.appendChild(scoreItem);
      }
    );
  }
};

export const updateScoreHistory = (
  playerNameInput: { value: string },
  score: number
) => {
  const playerName = playerNameInput.value;
  const playerScore = score;

  const scoreHistory = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  scoreHistory.push({ playerName, playerScore });
  localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));

  const scoreHistoryElement = document.getElementById(
    "scoreHistory"
  ) as HTMLElement;
  scoreHistoryElement.innerHTML = "";

  scoreHistory.forEach(
    ({
      playerName,
      playerScore,
    }: {
      playerName: string;
      playerScore: number;
    }) => {
      const scoreItem = document.createElement("div");
      scoreItem.textContent = `${playerName}: ${playerScore} points`;
      scoreHistoryElement.appendChild(scoreItem);
    }
  );
};
