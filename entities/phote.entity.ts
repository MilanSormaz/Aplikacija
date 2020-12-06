import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./article.entity";

@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Index("fk_photo_article_id", ["articleId"], {})
@Entity("phote")
export class Phote {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column( {type:"int", name: "article_id", unsigned: true })
  articleId: number;

  @Column( {
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128,
  })
  imagePath: string;

  @ManyToOne(() => Article, (article) => article.photes, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;
}
