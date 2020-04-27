import { Guy } from '../game-objects/guy'

export const closestNonGoalie = (guys: Guy[], x: number, y: number, predicate?: (guy: Guy) => boolean) => {
  const matches = guys
    .filter((p) => p.position !== 'goalie' && (!predicate || predicate(p)))
    .map((p) => ({ guy: p, distance: Phaser.Math.Distance.Between(p.x, p.y, x, y) }))
    .sort((a, b) => a.distance - b.distance)

  return matches.length ? matches[0].guy : undefined
}
