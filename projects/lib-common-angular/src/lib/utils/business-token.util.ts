export interface BusinessTokenPhoneClaim {
  number?: string;
  cityCode?: number | string;
  countryCode?: number | string;
  nameCity?: string;
  nameCountry?: string;
}

export interface BusinessTokenCityClaim {
  name?: string;
}

export interface BusinessTokenCountryClaim {
  name?: string;
  cities?: BusinessTokenCityClaim[] | null;
}

export interface BusinessTokenAddressClaim {
  adress?: string;
  country?: BusinessTokenCountryClaim | null;
}

export interface BusinessTokenDatesUserClaim {
  idDatesUser?: string;
  id?: string;
  firstName?: string;
  secondName?: string;
  idUrl?: string;
  estado?: string;
  nombreRol?: string;
  phone?: BusinessTokenPhoneClaim[] | null;
  addresses?: BusinessTokenAddressClaim[] | null;
}

export interface BusinessTokenClaims {
  idBusiness?: number | string;
  id?: string;
  sub?: string;
  email?: string;
  usuario?: string;
  username?: string;
  estado?: string;
  roles?: string[];
  datesUser?: BusinessTokenDatesUserClaim | null;
  exp?: number;
  [key: string]: unknown;
}

function toPaddedBase64(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return normalized + '='.repeat(padLength);
}

export function decodeBusinessToken(token: string | null | undefined): BusinessTokenClaims | null {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const decoded = atob(toPaddedBase64(payload));
    return JSON.parse(decoded) as BusinessTokenClaims;
  } catch {
    return null;
  }
}

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    sessionStorage.getItem('businessToken')
    || sessionStorage.getItem('token')
    || localStorage.getItem('businessToken')
    || localStorage.getItem('token')
  );
}

export function getSessionBusinessClaims(): BusinessTokenClaims | null {
  return decodeBusinessToken(getSessionToken());
}

export function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toStringOr(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim();
  return normalized || fallback;
}
