import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from 'src/entities/team.entity';
import { AuthGuard } from 'src/auth.guard';

@Controller('team')
export class TeamController {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  @Get()
  async getAllTeams(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  @Get(':id')
  async getTeamById(@Param('id') id: number): Promise<Team> {
    return await this.teamRepository.findOneBy({ id });
  }

  @Post()
  @UseGuards(AuthGuard)
  async createTeam(@Body() team: Team): Promise<Team> {
    return await this.teamRepository.save(team);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateTeam(
    @Param('id') id: number,
    @Body() updatedData: Partial<Team>,
  ): Promise<Team> {
    try {
      Logger.log('Updating team:', id);
      const team = await this.teamRepository.findOneBy({ id });
      Logger.log('Team found:', team.name);
      if (!team) {
        throw new NotFoundException('Team not found');
      }

      Object.assign(team, updatedData);
      Logger.log('Team updated:', team.name);
      return await this.teamRepository.save(team);
    } catch (error) {
      console.error('Error updating team:', error);
      throw new InternalServerErrorException('Failed to update team');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteTeam(@Param('id') id: number): Promise<void> {
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) {
      throw new Error('Team not found');
    }
    await this.teamRepository.remove(team);
  }
}
