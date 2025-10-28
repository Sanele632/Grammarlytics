// src/routes/paths.ts
export const routes = {
  root: "/",
  home: "/",
  practice: "/practice",
  user: "/user",
  userCreate: '/user/create',
  userUpdate: '/user/:id',
  userHistory: '/user/history',
  dailyChallenge: "/daily-challenge",
  learningResources: "/learning-resources",
} as const;

export type RouteKey = keyof typeof routes;
