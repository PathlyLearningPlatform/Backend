import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { DiToken } from '../enums';
import { ConfigService } from '@nestjs/config';
import neo4j from 'neo4j-driver'

@Module({
  providers: [{
    provide: DiToken.NEO4J_DRIVER,
    useFactory(configService: ConfigService) {
      const dbHost = configService.get<string>('dbHost')!
      const dbName = configService.get<string>('dbName')!
      const dbPassword = configService.get<string>('dbPassword')!
      const dbUser = configService.get<string>('dbUser')!
      const dbPort = configService.get<number>('dbPort')!
      const dbUri = `neo4j://${dbHost}:${dbPort}`

      const driver = neo4j.driver(dbUri, neo4j.auth.basic(dbUser, dbPassword))

      return driver
    },
    inject: [ConfigService],
  }, Neo4jService],
  exports: [Neo4jService]
})
export class Neo4jModule {}
