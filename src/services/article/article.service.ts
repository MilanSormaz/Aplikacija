import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "src/entities/article.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { ArticlePrice } from "src/entities/article-price.entity";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";


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

} 