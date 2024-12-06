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
    UploadedFiles, UseGuards, HttpException, HttpStatus, BadRequestException
} from '@nestjs/common';
import {ZemsService} from './zems.service';
import {CreateZemDto} from './dto/create-zem.dto';
import {UpdateZemDto} from './dto/update-zem.dto';
import {AnyFilesInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes} from "@nestjs/swagger";
import {diskStorage} from "multer";
import {extname} from 'path';
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UsersService} from "../users/users.service";
import {UserType} from "../Schemas/users_schema/Users.schema";
import {sendMessage} from "../services/helpers.service";


@Controller('zems')
export class ZemsController {
    constructor(private readonly zemsService: ZemsService, private readonly usersService: UsersService,) {
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AnyFilesInterceptor({
        storage: diskStorage({
            destination: './uploads', // Répertoire où stocker les fichiers
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Zems with files',
        type: CreateZemDto,
    })
    @Post()
    create(@Body() createZemDto: CreateZemDto,
           @UploadedFiles() files: Array<Express.Multer.File>,
           @Request() req,
    ) {

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
        return this.zemsService.create(createZemDto).then(zem => {
            this.usersService.update(user_id, {zem: zem["_id"], user_type: UserType.ZEM});
            return zem;
        }).catch(error => {
            console.error('Erreur lors de la création de Zem :', error);
            throw new HttpException('Erreur lors de la création du compte', HttpStatus.NOT_FOUND);
        });
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
            case "validated_zem":
                if (updateZemDto.profile_validation_status) {
                    updateZemDto.validated_at = new Date();
                    let user = await this.usersService.findUserOneByKey("zem", id);
                    if (user) {

                        //  sendMessage("Votre demande pour devenir conducteur a changé de statut", user["phone_number"]);
                    }
                } else {
                    throw new BadRequestException({"message": "le champs de la validation du profile est requis"});
                }
                break;

            case "change_status":
                if (updateZemDto.service == null) {
                    throw new BadRequestException({"message": "Veuillez renseigner tous les champs pour la mise en service"});
                } else {
                    if (updateZemDto.service) {
                        if (!updateZemDto.service_latitude || !updateZemDto.service_longitude) {
                            throw new BadRequestException({"message": "Veuillez renseigner tous les champs pour la mise en service"});
                        }
                    }
                }
                break;
        }

        return this.zemsService.update(id, updateZemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.zemsService.remove(id);
    }


}
