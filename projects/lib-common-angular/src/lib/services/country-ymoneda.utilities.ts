import { COUNTRIES_LIST, ICountry } from 'ngx-countries-dropdown';
import { getCountryCallingCode } from 'libphonenumber-js';

/**
 * Utilidades centralizadas para búsqueda de países y obtención de datos de monedas.
 * Reutilizable en múltiples componentes (country-dropdown, user-profile, etc).
 * Extrae dinámicamente la información de monedas desde COUNTRIES_LIST de ngx-countries-dropdown.
 *
 * @example
 * const country = CountryYmonedaUtilities.findCountryByCode('US');
 * const currency = CountryYmonedaUtilities.getCurrencyByCountryCode('US');
 * const symbol = CountryYmonedaUtilities.getCurrencySymbol('US');
 */
export class CountryYmonedaUtilities {
  private static currencyCache: Map<string, string> = new Map();

  /**
   * Construye el mapa de monedas dinámicamente desde COUNTRIES_LIST.
   * Caché interno para evitar recalcular.
   */
  private static buildCurrencyMap(): Map<string, string> {
    if (this.currencyCache.size > 0) {
      return this.currencyCache;
    }

    COUNTRIES_LIST.forEach((country) => {
      if (country && country.code && country.currency?.code) {
        const normalizedCode = String(country.code).toLowerCase();
        this.currencyCache.set(normalizedCode, country.currency.code);
      }
    });

    return this.currencyCache;
  }

  /**
   * Búsqueda de país por código ISO (2 letras).
   * @param countryCode Código de país (ej: 'US', 'CO', 'ES')
   * @returns País encontrado o null
   */
  public static findCountryByCode(countryCode: string): ICountry | null {
    const normalizedCountryCode = this.normalizeCountryCode(countryCode);
    if (!normalizedCountryCode) {
      return null;
    }

    return (
      COUNTRIES_LIST.find(
        (item) => this.normalizeCountryCode(this.extractCountryCode(item)) === normalizedCountryCode
      ) ?? null
    );
  }

  /**
   * Búsqueda de país por nombre.
   * @param countryName Nombre del país (ej: 'Colombia', 'United States')
   * @returns País encontrado o null
   */
  public static findCountryByName(countryName: string): ICountry | null {
    const normalizedCountryName = String(countryName ?? '').trim().toLowerCase();
    if (!normalizedCountryName) {
      return null;
    }

    return (
      COUNTRIES_LIST.find(
        (item) => String(item.name ?? '').trim().toLowerCase() === normalizedCountryName
      ) ?? null
    );
  }

  /**
   * Obtiene el código de moneda (ISO 4217) para un país dado.
   * Extrae dinámicamente desde COUNTRIES_LIST.
   * @param countryCode Código de país ISO 2 (ej: 'US', 'CO')
   * @returns Código de moneda (ej: 'USD', 'COP') o 'USD' por defecto
   */
  public static getCurrencyByCountryCode(countryCode: string): string {
    const normalized = String(countryCode ?? '').trim().toLowerCase().slice(0, 2);
    const currencyMap = this.buildCurrencyMap();
    return currencyMap.get(normalized) ?? 'USD';
  }

  /**
   * Obtiene información completa de moneda para un país.
   * @param countryCode Código de país ISO 2 (ej: 'US')
   * @returns Objeto con { code, name, symbol } o null si no se encuentra
   */
  public static getCurrencyInfo(countryCode: string): { code: string; name?: string; symbol?: string | null } | null {
    const country = this.findCountryByCode(countryCode);
    if (country?.currency) {
      return {
        code: country.currency.code ?? 'USD',
        name: country.currency.name,
        symbol: country.currency.symbol,
      };
    }
    return null;
  }

  /**
   * Resuelve el nombre de un país desde objeto ICountry o string.
   * @param country Objeto país o nombre de país en string
   * @returns Nombre del país o string vacío
   */
  public static resolveCountryName(country: ICountry | string | null | undefined): string {
    if (!country) {
      return '';
    }

    if (typeof country === 'string') {
      return this.findCountryByName(country)?.name ?? '';
    }

    return String(country.name ?? '');
  }

  /**
   * Resuelve el código ISO 2 de un país desde objeto ICountry o string.
   * @param country Objeto país o código/nombre en string
   * @returns Código normalizado (2 letras minúsculas) o string vacío
   */
  public static resolveCountryCode(country: ICountry | string | null | undefined): string {
    if (!country) {
      return '';
    }

    if (typeof country === 'string') {
      const normalizedCountryCode = this.normalizeCountryCode(country);
      if (normalizedCountryCode) {
        return normalizedCountryCode;
      }

      const matchedCountry = this.findCountryByName(country);
      return this.normalizeCountryCode(this.extractCountryCode(matchedCountry));
    }

    return this.normalizeCountryCode(this.extractCountryCode(country));
  }

  /**
   * Obtiene el código de llamada internacional de un país (ej: +1 para USA, +34 para España).
   * Requiere librería libphonenumber-js.
   * @param country Objeto país o código ISO 2
   * @returns Código de llamada como número o null si no se encuentra
   */
  public static resolveCallingCode(country: ICountry | string | null | undefined): number | null {
    try {
      const alpha2 = this.resolveCountryCode(country);
      return alpha2 ? Number(getCountryCallingCode(alpha2.toUpperCase() as Parameters<typeof getCountryCallingCode>[0])) : null;
    } catch {
      return null;
    }
  }

  /**
   * Retorna todas las monedas únicas del COUNTRIES_LIST.
   * Útil para poblar dropdowns, filtros, etc.
   * @returns Array de monedas únicas { code, name, symbol } ordenado por código
   */
  public static getAllCurrencies(): { code: string; name?: string; symbol?: string | null }[] {
    const currencyMap = new Map<string, { code: string; name?: string; symbol?: string | null }>();

    COUNTRIES_LIST.forEach((country) => {
      if (country?.currency?.code) {
        const code = country.currency.code;
        if (!currencyMap.has(code)) {
          currencyMap.set(code, {
            code,
            name: country.currency.name,
            symbol: country.currency.symbol,
          });
        }
      }
    });

    // Convertir a array y ordenar por código
    return Array.from(currencyMap.values()).sort((a, b) => a.code.localeCompare(b.code));
  }

  /**
   * Obtiene el símbolo de moneda para un país o código de moneda.
   * Primero intenta obtener del país, luego del código de moneda.
   * @param countryCodeOrCurrencyCode Código de país ISO 2 o código de moneda ISO 4217
   * @returns Símbolo de moneda (ej: '$', '€') o código si no se encuentra
   */
  public static getCurrencySymbol(countryCodeOrCurrencyCode: string): string {
    const normalized = String(countryCodeOrCurrencyCode ?? '').trim().toLowerCase().slice(0, 2);

    // Primero buscar por país
    const country = this.findCountryByCode(normalized);
    if (country?.currency?.symbol) {
      return country.currency.symbol;
    }

    // Si no es un país, buscar por código de moneda (ISO 4217 es 3 letras, así que verificar length)
    if (countryCodeOrCurrencyCode.length === 3) {
      const currencyCode = countryCodeOrCurrencyCode.toUpperCase();
      const symbolByCode = this.getSymbolFromCurrency(currencyCode);
      if (symbolByCode) {
        return symbolByCode;
      }
    }

    // Fallback a código si no se encuentra símbolo
    return countryCodeOrCurrencyCode.toUpperCase();
  }

  /**
   * Obtiene símbolo de moneda por código ISO 4217 (fallback map para casos específicos).
   * @param currencyCode Código ISO 4217 (ej: 'USD', 'EUR')
   * @returns Símbolo si se conoce, null si no
   */
  private static getSymbolFromCurrency(currencyCode: string): string | null {
    // Map de referencia para símbolos no estándar o ambiguos
    const symbolMap: Record<string, string> = {
      CHF: 'CHF',
      IDR: 'Rp',
      MYR: 'RM',
      SAR: 'ر.س',
      AED: 'د.إ',
      SEK: 'kr',
      NOK: 'kr',
    };
    return symbolMap[currencyCode] ?? null;
  }

  /**
   * Normaliza código de país a 2 letras en minúsculas.
   * @param value Código de país (puede ser de cualquier longitud/caso)
   * @returns Código normalizado (2 letras minúsculas) o string vacío si inválido
   */
  public static normalizeCountryCode(value: string): string {
    const cleaned = String(value ?? '').trim().toLowerCase();
    return cleaned.length >= 2 ? cleaned.slice(0, 2) : '';
  }

  /**
   * Extrae el código de país de un objeto ICountry.
   * Maneja propiedades 'code', 'isoCode' o 'name' como fallback.
   * @param country Objeto país
   * @returns Código extraído o string vacío
   */
  public static extractCountryCode(country: ICountry | null): string {
    if (!country) {
      return '';
    }

    if ('code' in country && country.code) {
      return String(country.code);
    }

    if ('isoCode' in country && country.isoCode) {
      return String(country.isoCode);
    }

    return String(country.name ?? '');
  }

  /**
   * Normaliza texto de búsqueda: quita acentos, convierte a minúsculas.
   * Permite búsqueda insensible a acentos (ej: 'México' = 'Mexico').
   * @param value Texto a normalizar
   * @returns Texto normalizado
   */
  public static normalizeSearchText(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Filtra lista de países por query (busca en nombre, código y dial code).
   * @param query Texto de búsqueda normalizado
   * @returns Array de códigos de país que coinciden (en minúsculas)
   */
  public static filterCountriesByQuery(query: string): string[] {
    if (!query) {
      return [];
    }

    return COUNTRIES_LIST
      .filter((item) => {
        const byName = this.normalizeSearchText(item.name).includes(query);
        const byCode = this.normalizeSearchText(item.code).includes(query);
        const byDial = this.normalizeSearchText(item.dialling_code).includes(query);
        return byName || byCode || byDial;
      })
      .map((item) => String(item.code).toLowerCase());
  }
}
