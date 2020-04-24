export enum CollisionCategory {
  All = 1,
  Ball = 2,
  GoalRestrictedAreaHome = 4,
  GoalRestrictedAreaAway = 8,
  GoalScoreAreaHome = 16,
  GoalScoreAreaAway = 32,
  HomeTeam = 64,
  AwayTeam = 128,
  HomeGoalie = 256,
  AwayGoalie = 512,
}

export const FieldPlayerCollisionMask =
  CollisionCategory.All |
  CollisionCategory.Ball |
  CollisionCategory.GoalRestrictedAreaHome |
  CollisionCategory.GoalRestrictedAreaAway |
  CollisionCategory.HomeTeam |
  CollisionCategory.AwayTeam |
  CollisionCategory.HomeGoalie |
  CollisionCategory.AwayGoalie

export const HomeGoalieCollisionMask =
  CollisionCategory.All |
  CollisionCategory.Ball |
  CollisionCategory.GoalRestrictedAreaAway |
  CollisionCategory.HomeTeam |
  CollisionCategory.AwayTeam |
  CollisionCategory.HomeGoalie |
  CollisionCategory.AwayGoalie

export const AwayGoalieCollisionMask =
  CollisionCategory.All |
  CollisionCategory.Ball |
  CollisionCategory.GoalRestrictedAreaHome |
  CollisionCategory.HomeTeam |
  CollisionCategory.AwayTeam |
  CollisionCategory.HomeGoalie |
  CollisionCategory.AwayGoalie

export const BallCollisionMask =
  CollisionCategory.All |
  CollisionCategory.HomeTeam |
  CollisionCategory.AwayTeam |
  CollisionCategory.HomeGoalie |
  CollisionCategory.AwayGoalie
