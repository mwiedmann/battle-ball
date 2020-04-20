export const gameSettings = {
  fieldWidth: 1920,
  fieldHeight: 1080,
  gameCameraZoom: 2,
  worldBoundEdgeSize: 32,
}

export const settingsHelpers = {
  fieldWidthMid: gameSettings.fieldWidth / 2,
  fieldHeightMid: gameSettings.fieldHeight / 2,
  worldBoundWidth: gameSettings.fieldWidth + 2 * gameSettings.worldBoundEdgeSize,
  worldBoundHeight: gameSettings.fieldHeight + 2 * gameSettings.worldBoundEdgeSize,
}
