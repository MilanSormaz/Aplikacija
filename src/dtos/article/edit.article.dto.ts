export class EditArticleDto {
    name: string;
    categoryId: number;
    excerpt: string;
    desktription: string;
    status: 'available' | 'visible' | 'hidden';
    isPromoted: 0 | 1;
    price: number;
    features: {
        featureId: number;
        value; string;
    }[] | null;
}