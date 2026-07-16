import { ConfigService } from '@nestjs/config';
import { buildTypeOrmOptions } from './typeorm.config';

describe('buildTypeOrmOptions', () => {
  it('throws a clear error when DATABASE_URL is missing', () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;

    expect(() => buildTypeOrmOptions(configService)).toThrow(
      'DATABASE_URL is not set. Create a .env file with your Neon connection string.',
    );
  });

  it('returns SSL settings for Neon connections', () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'DATABASE_URL') {
          return 'postgres://user:password@ep-test.us-east-2.aws.neon.tech/neondb?sslmode=require';
        }

        return undefined;
      }),
    } as unknown as ConfigService;

    const options = buildTypeOrmOptions(configService);

    expect(options.type).toBe('postgres');
    expect(options.url).toContain('neon.tech');
    expect(options.ssl).toEqual({ rejectUnauthorized: false });
  });
});
