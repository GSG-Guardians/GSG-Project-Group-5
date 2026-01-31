export type GoogleTokenResponse = {
  access_token: string;
  id_token: string;
};

export type GoogleIdTokenPayload = {
  iss: 'https://accounts.google.com' | 'accounts.google.com';
  azp?: string;
  aud: string;
  sub: string;
  email?: string;
  email_verified?: boolean;
  at_hash?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;

  iat: number;
  exp: number;

  hd?: string;
  nonce?: string;

  [key: string]: unknown;
};
