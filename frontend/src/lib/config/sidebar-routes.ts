export const Routes = {
    chat: "/chat",
    profileAccount: "/settings/profile",
    profileIntegration: "/settings/integration",
    profileSettings: "/settings/account",
  } as const;
  
  export type ValidRoute = (typeof Routes)[keyof typeof Routes];
  
  export function isValidRoute(path: string): path is ValidRoute {
    return Object.values(Routes).includes(path.toLowerCase() as ValidRoute);
  }
  