import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';
import { TeamController } from './team/team.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'scoreboard-db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Team],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Team]),
  ],
  controllers: [TeamController],
})
export class AppModule {}
