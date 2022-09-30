// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appId: "bpd",
  env: "develop",
  production: false,

  appAlias: "test-boilerplate",
  appUrl: "http://localhost:4201/",
  authAppUrl: "https://test-auth.minambiente.gov.co",
  domain: "localhost",

  apiBase: "http://localhost:8000/api/",

  privateKey:
    "-----BEGIN EC PRIVATE KEY-----\n" +
    "MHcCAQEEIKayiiMPbOBmZIi+iGxd+bkt3EE2srN/isFR4rnQp+dwoAoGCCqGSM49\n" +
    "AwEHoUQDQgAEArfU3ust80VEw+D0/g1FaesXhTnRJ6LPUZQKeHF65pRMGHt1nv7X\n" +
    "kMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n" +
    "-----END EC PRIVATE KEY-----",
  publicKey:
    "-----BEGIN PUBLIC KEY-----\n" +
    "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEArfU3ust80VEw+D0/g1FaesXhTnR\n" +
    "J6LPUZQKeHF65pRMGHt1nv7XkMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n" +
    "-----END PUBLIC KEY-----",

  jwtAud: "localhost:4201",
  jwtIss: "localhost:3000",

  googleOAuthClientId:
    "3474526703-vp4jg24a9sg6pdq1rledr5vaebrhtkb7.apps.googleusercontent.com",
  reCaptchaSiteKey: "6LeowwsTAAAAAPrV0G3kzxg1E9ehhcxEM2pb4LPE",

  sentryDsn: "https://cd82021fc08841e5bf8b546710b764c5@sentry.io/1382267",

  minDelay: 500,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
