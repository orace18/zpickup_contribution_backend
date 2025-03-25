import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    Request,
    UploadedFiles,
    UseGuards,
    HttpException,
    HttpStatus,
    BadRequestException,
    UploadedFile,
} from '@nestjs/common';
import { ZemsService } from './zems.service';
import { CreateZemDto } from './dto/create-zem.dto';
import { UpdateZemDto } from './dto/update-zem.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserType } from '../Schemas/users_schema/Users.schema';
import { ZemValidationService } from './zem-validation.service';
import { CounterService } from "../counter/counter.service";
import { count } from "rxjs";
import { Counter } from "../Schemas/counter_schema/counter.schema";
import { ProfileValidationStatus } from 'src/Schemas/zems_schema/Zems.schema';
import { RolesGuard } from 'src/common/guards/role.guard';
import { RequiredRoles } from 'src/common/decorators/role.decorator';

@Controller('zems')
export class ZemsController {
    constructor(
        private readonly zemsService: ZemsService,
        private readonly usersService: UsersService,
        private readonly zemValidationService: ZemValidationService,
        private readonly counterService: CounterService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AnyFilesInterceptor({
            storage: diskStorage({
                destination: './uploads', // Répertoire où stocker les fichiers
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(
                        null,
                        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
                    );
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Zems with files',
        type: CreateZemDto,
    })
    @Post()
    async create(
        @Body() createZemDto: CreateZemDto,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Request() req,
    ) {

        const existingZem = await this.zemsService.findByUserId(req.user.userId);
        if (existingZem) {
            throw new HttpException('Un Zem existe déjà pour cet utilisateur', HttpStatus.BAD_REQUEST);
        }

        files.forEach((file) => {
            switch (file.fieldname) {
                case 'card_image':
                    createZemDto.card_image = file.path;
                    break;
                case 'zem_profile_image':
                    createZemDto.zem_profile_image = file.path;
                    break;
                case 'image_of_residence_certificate':
                    createZemDto.image_of_residence_certificate = file.path;
                    break;
                case 'ifu_number_image':
                    createZemDto.ifu_number_image = file.path;
                    break;
                case 'plate_picture':
                    createZemDto.plate_picture = file.path;
                    break;
            }
        });
        const user_id = req.user.userId;
        createZemDto.user = user_id;
        createZemDto.validated_at = null;
        return this.zemsService
            .create(createZemDto)
            .then((zem) => {
                this.usersService.update(user_id, {
                    zem: zem['_id'],
                    user_type: UserType.ZEM,
                });
                return zem;
            })
            .catch((error) => {
                console.error('Erreur lors de la création de Zem :', error);
                throw new HttpException(
                    'Erreur lors de la création du compte',
                    HttpStatus.NOT_FOUND,
                );
            });
    }


    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AnyFilesInterceptor({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(
                        null,
                        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
                    );
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Update temporal Zem with documents',
        type: UpdateZemDto,
    })
    @Patch('update-temporal-documents/:id')
    async updateTemporalZemWithDocuments(
        @Param('id') id: string,
        @Body() updateZemDto: UpdateZemDto,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Request() req,
    ) {

        const zem = await this.zemsService.findOne(id);
        if (!zem) {
            throw new HttpException('Zem non trouvé', HttpStatus.NOT_FOUND);
        }

        files.forEach((file) => {
            switch (file.fieldname) {
                case 'card_image':
                    updateZemDto.card_image = file.path;
                    break;
                case 'zem_profile_image':
                    updateZemDto.zem_profile_image = file.path;
                    break;
                case 'image_of_residence_certificate':
                    updateZemDto.image_of_residence_certificate = file.path;
                    break;
                case 'ifu_number_image':
                    updateZemDto.ifu_number_image = file.path;
                    break;
                case 'plate_picture':
                    updateZemDto.plate_picture = file.path;
                    break;
            }
        });

        try {
            // Vérifier si l'ID du ZEM appartient bien à l'utilisateur connecté
            const zem = await this.zemsService.findOne(id);

            if (!zem) {
                throw new HttpException('Zem not found', HttpStatus.NOT_FOUND);
            }

            // Mettre à jour le ZEM avec les documents
            updateZemDto.is_temporal = false; // Passer de temporaire à permanent
            updateZemDto.profile_validation_status = ProfileValidationStatus.IN_PROGRESS; // Remettre en validation

            const updatedZem = await this.zemsService.update(id, updateZemDto);

            return {
                result: updatedZem,
                message: 'Documents soumis avec succès, en attente de validation'
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du ZEM :', error);
            throw new HttpException(
                error.message || 'Erreur lors de la soumission des documents',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    findAll() {
        return this.zemsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.zemsService.findOne(id);
    }


    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateZemDto: UpdateZemDto) {
        switch (updateZemDto.type_action) {
            case 'validated_zem':
                if (updateZemDto.profile_validation_status === 'validated') {
                    return this.zemValidationService.validateZem(id);
                } else {
                    throw new BadRequestException({
                        message: 'le champs de la validation du profile est requis',
                    });
                }
                break;

            case 'change_status':
                if (updateZemDto.service == null) {
                    throw new BadRequestException({
                        message:
                            'Veuillez renseigner tous les champs pour la mise en service',
                    });
                } else {
                    if (updateZemDto.service) {
                        const counter = await this.counterService.findByZem(id);
                        console.log("counter",  counter);

                        if (counter == null || counter.balance_km <= 0) {
                            throw new BadRequestException({
                                message: 'Veuillez recharger votre compteur avant de pourvoir travailler',
                            });
                        } else {
                            if (
                                !updateZemDto.service_latitude ||
                                !updateZemDto.service_longitude
                            ) {
                                throw new BadRequestException({
                                    message:
                                        'Veuillez renseigner tous les champs pour la mise en service',
                                });
                            }
                          //  this.usersService.update()
                        }
                    }
                    const zem = await this.zemsService.findOne(id);
                    this.usersService.update(zem['user']['_id'].toString(),{race:null});
                    this.zemsService.update(id, updateZemDto);
                    this.zemsService.sendNotificationForAllUserInRay(id,zem);

                }

                break;
        }

        return this.zemsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.zemsService.remove(id);
    }

    @Patch('update-rayon/:id')
    async updateSearchRadius(
        @Param('id') id: string,
        @Body() updateData: { ray: number }
    ) {
        try {
            const updatedZem = await this.zemsService.updateSearchRadius(id, updateData.ray);
            return {
                result: updatedZem,
                message: 'Rayon de recherche mis à jour avec succès'
            };
        } catch (error) {
            return {
                error: error.message
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-temporary')
    async createTemporaryZem(@Body() createZemDto: CreateZemDto, @Request() req) {
        const user_id = req.user.userId;
        createZemDto.user = user_id;
        createZemDto.validated_at = null;
        createZemDto.is_temporal = true; // Indiquer que c'est une validation temporaire
        createZemDto.is_temporal = true;

        try {
            const zem = await this.zemsService.create(createZemDto);
            this.usersService.update(user_id, {
                zem: zem['_id'],
                user_type: UserType.ZEM,
            });

            await this.counterService.createCounter(zem['_id'].toString());

            return zem;
        } catch (error) {
            console.error('Erreur lors de la création de Zem temporaire :', error);
            throw new HttpException(
                'Erreur lors de la création du compte temporaire',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @UseInterceptors(
        FileInterceptor('contrat_document', {
            storage: diskStorage({
                destination: './uploads/contracts',
                filename: (req, file, callback) => {
                    // Vérifier si le fichier est un PDF
                    if (file.mimetype !== 'application/pdf') {
                        return callback(
                            new BadRequestException('Seuls les fichiers PDF sont acceptés'),
                            null
                        );
                    }

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(
                        null,
                        `contrat-${uniqueSuffix}${extname(file.originalname)}`,
                    );
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB maximum
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                contrat_document: {
                    type: 'string',
                    format: 'binary',
                    description: 'Document de contrat au format PDF',
                },
            },
        },
    })
    @Patch('make_ambassador/:id')
    async makeAmbassador(
        @Param('id') id: string,
        @UploadedFile() contratDocument: Express.Multer.File,
    ) {
        try {
            // Vérifier si le fichier a été téléchargé
            if (!contratDocument) {
                throw new BadRequestException('Le document de contrat (PDF) est requis');
            }

            // Appeler le service avec le chemin du fichier
            const updatedZem = await this.zemsService.makeAmbassador(id, contratDocument.path);

            return {
                result: updatedZem,
                message: 'Zem promu ambassadeur avec succès',
                contrat_document: contratDocument.path
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            return {
                error: error.message
            };
        }
    }


    @UseGuards(JwtAuthGuard)
    @Post('add-manual-km/:id')
    async addManualKmToAmbassador(@Param('id') id: string) {
        console.log('Received Zem ID:', id);
        try {
            const zem = await this.zemsService.findOne(id);
            if (!zem) {
                throw new HttpException('Zem non trouvé', HttpStatus.NOT_FOUND);
            }

            if (!zem.is_ambassador) {
                throw new BadRequestException('Ce zem n\'est pas un ambassadeur');
            }

            const result = await this.zemsService.addManualKmToAmbassador(id);

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    @Post('add-km-to-all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequiredRoles(UserType.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add manual km to all ambassadors' })
    @ApiResponse({ status: 200, description: 'Kilometers successfully added to all ambassadors' })
    async addKmToAllAmbassadors() {
        return this.zemsService.addManualKmToAllAmbassadors();

    }

    @UseGuards(JwtAuthGuard)
  @Get('km-history/:id')
  @ApiOperation({ summary: 'Get km addition history for a Zem' })
  @ApiResponse({
    status: 200,
    description: 'Returns the history of km additions for the specified Zem'
  })
  async getKmHistory(@Param('id') id: string) {
    try {
      const history = await this.zemsService.getAmbassadorKmHistory(id);
      return {
        success: true,
        data: history
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

