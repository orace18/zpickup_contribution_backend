import {Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import {RacesService} from './races.service';
import {CreateRaceDto} from './dto/create-race.dto';
import {UpdateRaceDto} from './dto/update-race.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CoursesStatus} from "../Schemas/races_schema/races.schema";

@UseGuards(JwtAuthGuard)
@Controller('races')
export class RacesController {
    constructor(private readonly racesService: RacesService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createRaceDto: CreateRaceDto, @Request() req,) {
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
    update(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto, @Request() req,) {
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
    availableRaces(@Request() req,) {
        return this.racesService.availableRaces(req);
    }


}
