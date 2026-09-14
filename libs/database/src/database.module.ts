import { AppConfigModule, AppConfigService } from '@app/config';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [AppConfigModule],
          inject: [AppConfigService],
          useFactory(config: AppConfigService) {
            return {
              uri: config.mongodb.uri,
              dbName: config.mongodb.db,
              minPoolSize: config.mongodb.minPoolSize,
              maxPoolSize: config.mongodb.maxPoolSize,
            };
          },
        }),
      ],
    };
  }
}
