export const environment = {
  appId: 'bpt',
  env: 'test',

  appUrl: 'https://psa-front.netlify.app',
  authAppUrl: 'https://test-auth.minambiente.gov.co',
  domain: 'psa-front.netlify.app',

  apiBase: 'https://test-api.minambiente.gov.co',

  privateKey:
    '-----BEGIN EC PRIVATE KEY-----\n' +
    'MHcCAQEEIKayiiMPbOBmZIi+iGxd+bkt3EE2srN/isFR4rnQp+dwoAoGCCqGSM49\n' +
    'AwEHoUQDQgAEArfU3ust80VEw+D0/g1FaesXhTnRJ6LPUZQKeHF65pRMGHt1nv7X\n' +
    'kMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n' +
    '-----END EC PRIVATE KEY-----',
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEArfU3ust80VEw+D0/g1FaesXhTnR\n' +
    'J6LPUZQKeHF65pRMGHt1nv7XkMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n' +
    '-----END PUBLIC KEY-----',

  jwtAud: 'https://psa-front.netlify.app',
  jwtIss: 'https://test-api.minambiente.gov.co',

  googleOAuthClientId:
    '3474526703-vp4jg24a9sg6pdq1rledr5vaebrhtkb7.apps.googleusercontent.com',
  reCaptchaSiteKey: '6LeowwsTAAAAAPrV0G3kzxg1E9ehhcxEM2pb4LPE',

  sentryDsn: 'https://cd82021fc08841e5bf8b546710b764c5@sentry.io/1382267',

  minDelay: 500,
};
