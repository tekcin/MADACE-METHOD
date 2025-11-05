/**
 * Module Alias Resolution Tests (COMPAT-002)
 * Tests BMAD-MADACE module name compatibility
 */

import { resolveModuleAlias, getModuleVariants, getFrameworkVariants } from '@/lib/agents/loader';

describe('Module Aliases (COMPAT-002)', () => {
  describe('resolveModuleAlias', () => {
    it('should resolve BMAD module names to MADACE equivalents', () => {
      expect(resolveModuleAlias('bmm')).toBe('mam');
      expect(resolveModuleAlias('bmb')).toBe('mab');
      expect(resolveModuleAlias('BMM')).toBe('mam');
      expect(resolveModuleAlias('BMB')).toBe('mab');
    });

    it('should resolve MADACE module names to BMAD equivalents', () => {
      expect(resolveModuleAlias('mam')).toBe('bmm');
      expect(resolveModuleAlias('mab')).toBe('bmb');
      expect(resolveModuleAlias('MAM')).toBe('bmm');
      expect(resolveModuleAlias('MAB')).toBe('bmb');
    });

    it('should return normalized module name if no alias exists', () => {
      expect(resolveModuleAlias('cis')).toBe('cis');
      expect(resolveModuleAlias('core')).toBe('core');
      expect(resolveModuleAlias('CIS')).toBe('cis');
    });
  });

  describe('getModuleVariants', () => {
    it('should return both module name and its alias', () => {
      expect(getModuleVariants('mam')).toEqual(['mam', 'bmm']);
      expect(getModuleVariants('bmm')).toEqual(['bmm', 'mam']);
      expect(getModuleVariants('mab')).toEqual(['mab', 'bmb']);
      expect(getModuleVariants('bmb')).toEqual(['bmb', 'mab']);
    });

    it('should return only the module name if no alias exists', () => {
      expect(getModuleVariants('cis')).toEqual(['cis']);
      expect(getModuleVariants('core')).toEqual(['core']);
    });

    it('should normalize case', () => {
      expect(getModuleVariants('MAM')).toEqual(['mam', 'bmm']);
      expect(getModuleVariants('BMM')).toEqual(['bmm', 'mam']);
    });
  });

  describe('getFrameworkVariants', () => {
    it('should return both framework name and its alias', () => {
      expect(getFrameworkVariants('madace')).toEqual(['madace', 'bmad']);
      expect(getFrameworkVariants('bmad')).toEqual(['bmad', 'madace']);
    });

    it('should normalize case', () => {
      expect(getFrameworkVariants('MADACE')).toEqual(['madace', 'bmad']);
      expect(getFrameworkVariants('BMAD')).toEqual(['bmad', 'madace']);
    });

    it('should return only the framework name if no alias exists', () => {
      expect(getFrameworkVariants('other')).toEqual(['other']);
    });
  });

  describe('Real-world compatibility scenarios', () => {
    it('should support BMM/MAM interchangeability', () => {
      // A BMAD user using "bmm" should get the same result as MADACE user using "mam"
      const bmadModule = 'bmm';
      const madaceModule = 'mam';

      expect(getModuleVariants(bmadModule)).toContain('mam');
      expect(getModuleVariants(madaceModule)).toContain('bmm');
    });

    it('should support BMB/MAB interchangeability', () => {
      // A BMAD user using "bmb" should get the same result as MADACE user using "mab"
      const bmadModule = 'bmb';
      const madaceModule = 'mab';

      expect(getModuleVariants(bmadModule)).toContain('mab');
      expect(getModuleVariants(madaceModule)).toContain('bmb');
    });
  });
});
