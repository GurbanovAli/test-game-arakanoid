const saveButton = document.getElementById("saveButton");
const playerNameInput = document.getElementById(
  "playerName"
) as HTMLInputElement;

export const createListener = (start: () => void): void => {
  if (saveButton && playerNameInput) {
    saveButton.addEventListener("click", start);
    playerNameInput.value = "";
  }
  return;
};
