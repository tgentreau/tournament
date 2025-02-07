import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = {
      type: configService.get<string>('FB_TYPE'),
      project_id: configService.get<string>('FB_PROJECT_ID'),
      private_key_id: configService.get<string>('FB_PRIVATE_KEY_ID'),
      private_key: configService.get<string>('FB_PRIVATE_KEY'),
      client_email: configService.get<string>('FB_CLIENT_EMAIL'),
      client_id: configService.get<string>('FB_CLIENT_ID'),
      auth_uri: configService.get<string>('FB_AUTH_URI'),
      token_uri: configService.get<string>('FB_TOKEN_URI'),
      auth_provider_x509_cert_url: configService.get<string>(
        'FB_AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: configService.get<string>(
        'FB_CLIENT_X509_CERT_URL',
      ),
      universe_domain: configService.get<string>('FB_UNIVERSE_DOMAIN'),
    } as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider],
  exports: [],
})
export class FirebaseModule {}
