import { LibConfigService } from './lib-config.service';

describe('LibConfigService authentication tenant', () => {
  it('preserves legacy login when no tenant is configured', () => {
    expect(new LibConfigService({}).getAuthTenantId()).toBeUndefined();
  });

  it('accepts the existing idBusiness configuration', () => {
    expect(new LibConfigService({ idBusiness: 7 }).getAuthTenantId()).toBe(7);
  });

  it('prioritizes the login contract spelling idBussines', () => {
    expect(new LibConfigService({ idBusiness: 7, idBussines: 8 }).getAuthTenantId()).toBe(8);
  });

  it('rejects invalid tenant values rather than choosing another business', () => {
    for (const idBussines of [0, -1, 1.5, Number.NaN]) {
      expect(() => new LibConfigService({ idBussines }).getAuthTenantId()).toThrowError();
    }
  });
});
