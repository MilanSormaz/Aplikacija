import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Phote } from "src/entities/phote.entity";
import { Repository } from "typeorm";

@Injectable()
export class PhotoService extends TypeOrmCrudService<Phote> {
    constructor(@InjectRepository(Phote) private readonly photo: Repository<Phote>){
        super(photo);
    }
    add(newPhoto: Phote): Promise<Phote> {
        return this.photo.save(newPhoto);
    }
}