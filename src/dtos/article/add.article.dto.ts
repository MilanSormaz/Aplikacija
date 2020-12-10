export class AddArticleDto {
    name: string;
    categoryId: number;
    excerpt: string;
    desktription: string;
    price: number;
    features: {
        featureId: number;
        value; string;
    }[];
}