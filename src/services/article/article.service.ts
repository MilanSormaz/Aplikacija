import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "src/entities/article.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { ArticlePrice } from "src/entities/article-price.entity";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { dataCollectionPhase } from "typeorm-model-generator/dist/src/Engine";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { throws } from "assert";


@Injectable()
export class ArticleService extends TypeOrmCrudService<Article> {
    constructor(
    @InjectRepository(Article) private readonly article: Repository<Article>,
    
    @InjectRepository(ArticlePrice) private readonly articlePrice: Repository<ArticlePrice>,

    @InjectRepository(ArticleFeature) private readonly articleFeature: Repository<ArticleFeature>,
    
    ){
        super(article);
    }

    async createFullArticle(data: AddArticleDto): Promise<Article | ApiResponse> {
        let newArticle: Article = new Article();
        newArticle.name         = data.name;
        newArticle.categoryId   = data.categoryId;
        newArticle.excerpt      = data.excerpt;
        newArticle.desktription = data.desktription;

            let saveArticle = await this.article.save(newArticle);

            let newArticlePrice: ArticlePrice = new ArticlePrice();
            newArticlePrice.articleId = saveArticle.articleId;
            newArticlePrice.price     = data.price;

            await this.articlePrice.save(newArticlePrice);

            for (let feature of data.features) {
                let newArticleFeature: ArticleFeature = new ArticleFeature();
                newArticleFeature.articleId = saveArticle.articleId;
                newArticleFeature.featureId = feature.featureId;
                newArticleFeature.value     = feature.value;

                await this.articleFeature.save(newArticleFeature);
            } 

            return await this.article.findOne(saveArticle.articleId, {
                relations: [
                    "category",
                    "articleFeatures",
                    "features",
                    "articlePrices"
                ]
            });

    }

    async editFullArticle(articleId: number, data: EditArticleDto): Promise <Article | ApiResponse> {
        const existingArticle: Article = await this.article.findOne(articleId, {
            relations: [ 'articlePrices', 'articleFeatures' ]
        });

        if (!existingArticle) {
            return new ApiResponse('error', -5001, 'Article not found.');            
        }

        existingArticle.name        = data.name;
        existingArticle.categoryId  = data.categoryId;
        existingArticle.excerpt     = data.excerpt;
        existingArticle.desktription = data.desktription;
        existingArticle.status      = data.status;
        existingArticle.isPromoted  = data.isPromoted;
        
        const saveArticle = await this.article.save(existingArticle);
        if (!saveArticle) {
            return new ApiResponse('error', -5002, 'Could not find article data.');
        }

        const newPriceString: string = Number(data.price).toFixed(2);
        const lastPrice = existingArticle.articlePrices[existingArticle.articlePrices.length-1].price
        const lastPriceString: string = Number(data.price).toFixed(2);
        
        if (newPriceString !== lastPriceString) {
            const newArticlePrice = new ArticlePrice();
            newArticlePrice.articleId = articleId;
            newArticlePrice.price = data.price;
            
            const saveArticlePrice = await this.articlePrice.save(newArticlePrice);
            if (!saveArticlePrice) {
                return new ApiResponse('error', -5003, 'Could not save the new article price.');
            }
        }

        if (data.features !== null) {
            await this.articleFeature.remove(existingArticle.articleFeatures);

            for (let feature of data.features) {
            let newArticleFeature: ArticleFeature = new ArticleFeature();
            newArticleFeature.articleId = articleId;
            newArticleFeature.featureId = feature.featureId;
            newArticleFeature.value     = feature.value;

            await this.articleFeature.save(newArticleFeature);
            }
        }

        return await this.article.findOne(saveArticle.articleId, {
            relations: [
                "category",
                "articleFeatures",
                "features",
                "articlePrices"
            ]
        });

    }
    existingArticle(existingArticle: any) {
        throw new Error("Method not implemented.");
    }
} 