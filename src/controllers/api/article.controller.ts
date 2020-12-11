import {Body, Controller, Post, Param, UseInterceptors, UploadedFile, Req} from "@nestjs/common";
import {Crud} from "@nestjsx/crud";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { StorageConfig } from "config/storage.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { PhotoService } from "src/services/photo/photo.service";
import { diskStorage } from "multer";
import { Phote } from "src/entities/phote.entity";
import { ApiResponse } from "src/misc/api.response.class";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';


@Controller('api/article')
@Crud({
    model: {
        type: Article
    },
    params: {
        id: {
            field: 'articleId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            category: {
                eager: true
            },
            photes: {
                eager: true
            },
            articlePrices: {
                eager: true
            },
            articleFeatures: {
                eager: true
            },
            features: {
                eager: true
            }
        }
    }
})
export class ArticleController {
    constructor(
        public service: ArticleService,
        public photoService: PhotoService,
    ){}

    @Post('createFull')
    createFullArticle(@Body() data: AddArticleDto) {
        return this.service.createFullArticle(data);
        }

    @Post(':id/uploadPhoto/')
    @UseInterceptors(
        FileInterceptor('photo', { 
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
                filename: (req, file, callback) => {
                    let original: string = file.originalname;

                    let normalized = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
                    let sada = new Date();
                    let dataPart = '';
                    dataPart += sada.getFullYear().toString();
                    dataPart += (sada.getMonth() + 1).toString();
                    dataPart += sada.getDate().toString();

                    let randomPart: string = 
                        new Array(10)
                            .fill(0)
                            .map(e => (Math.random() * 9).toFixed(0).toString())
                            .join('');

                    let fileName = dataPart + '-' + randomPart + '-' + normalized; 
                        fileName = fileName.toLocaleLowerCase();

                    callback(null, fileName);
                }                
            }),
            fileFilter: (req, file, callback) => {
                if (file.originalname.toLowerCase().match(/\.(jpg|png)$/)) {
                    req.fileFilterError = 'Bad file extension';
                    callback(null, false);
                    return;
                }
                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                    req.fileFilterError = 'Bad file extension';
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.photo.maxSize        
            },
        })
    )
    async uploadPhoto(
        @Param('id') articleId: number, 
        @UploadedFile() photo,
        @Req() req
    ): Promise<ApiResponse | Phote> {
        
        if (req.fileFilterError) {
            return new ApiResponse('error', -4002, req.fileFilterError);
        }

        if (!photo) {
            return new ApiResponse('error', -4002, 'Photo not uploaded');
        }

        const fileTypeResult = await fileType.fromFile(photo.path);
        if (!fileTypeResult) {
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -4002, 'Cannot detect file type!');
        }

        const realMimeType = fileTypeResult.mime;
        if (!(realMimeType.includes('jpeg') || realMimeType.includes('png'))) {
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -4002, 'Bad file content type!');
        }

        await this.createResizedImage(photo, StorageConfig.photo.resize.thumb);
        await this.createResizedImage(photo, StorageConfig.photo.resize.small);

        const newPhoto: Phote = new Phote();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if (!savedPhoto) {

            return new ApiResponse('error', -4001);
        }
    
        return savedPhoto;
    }



async createResizedImage(photo, resizeSettings) {

          const originalFilePath = photo.path;
        const fileName = photo.filename;
    
        const destinationFilePath = StorageConfig.photo.destination + 
        StorageConfig.photo.resize.small.directory + 
        fileName;
    
        await sharp(originalFilePath)
        .resize({
            fir: 'cover',
            width: resizeSettings.small.width,
            height: resizeSettings.small.height,
    
        })
        .toFile(destinationFilePath);

    }
}