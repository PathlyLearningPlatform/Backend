import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { DiToken } from "../enums";
import { Driver } from 'neo4j-driver';
import { AppLogger } from "@pathly-backend/common/index.js";

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(DiToken.NEO4J_DRIVER) private readonly driver: Driver, @Inject(AppLogger) private readonly logger: AppLogger) { }

  async onModuleInit() {
    const info = await this.driver.getServerInfo()

    this.logger.log(`Connected to neo4j on: ${info.address}`)
  }

  get db(): Driver {
    return this.driver
  }

  async onModuleDestroy() {
    await this.driver.close()
  }
}