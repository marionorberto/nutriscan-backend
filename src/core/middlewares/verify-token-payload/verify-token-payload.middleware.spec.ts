import { VerifyTokenPayloadMiddleware } from './verify-token-payload.middleware';

describe('VerifyTokenPayloadMiddleware', () => {
  it('should be defined', () => {
    expect(new VerifyTokenPayloadMiddleware()).toBeDefined();
  });
});
