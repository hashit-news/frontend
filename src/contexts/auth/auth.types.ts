export interface JwtPayloadDto {
  sub: string;
  name?: string | null;
  iat?: number;
  exp?: number;
}

export type AuthenticatedUser = {
  id: string;
  username?: string | null;
  walletAddress: string;
  walletType: 'metamask';
  chainId: number;
};
