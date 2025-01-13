import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RacesService } from './races.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoursesStatus } from '../Schemas/races_schema/races.schema';
import { Race } from './entities/race.entity';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRaceDto: CreateRaceDto, @Request() req) {
    return this.racesService.create(createRaceDto, req);
  }

  @Get()
  findAll() {
    return this.racesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.racesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRaceDto: UpdateRaceDto,
    @Request() req,
  ) {
    return this.racesService.update(id, updateRaceDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.racesService.remove(+id);
  }

  @Get('available/zems/:id')
  availableForRace(@Param('id') id: string) {
    return this.racesService.availableZems(id);
  }

  @Get('available/races')
  availableRaces(@Request() req) {
    return this.racesService.availableRaces(req);
  }

  @Get('user/races/list')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Request() req: any) {
    // L'ID de l'utilisateur est extrait du token JWT
    const userId = req.user.userId;

    // Récupérer toutes les courses associées à cet utilisateur
    return this.racesService.findAllRacesByUser(userId);
  }

  @Get('zem/races/:zemId')
  @UseGuards(JwtAuthGuard)
  async getRacesByZem(@Param('zemId') zemId: string) {
    // Appel au service pour récupérer les courses du zem
    return this.racesService.findAllRacesByZem(zemId);
  }

  @Get('race-history/:zemId')
  @ApiOperation({ summary: 'Get race history for a Zem' })
  @ApiParam({ name: 'zemId', description: 'ID of the Zem' })
  @ApiResponse({
    status: 200,

    description: 'Returns the complete race history for the specified Zem',
  })
  async getRaceHistory(@Param('zemId') zemId: string) {
    return this.racesService.getRaceHistory(zemId);
  }
}
