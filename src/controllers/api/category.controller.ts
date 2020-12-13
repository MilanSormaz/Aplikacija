import {Controller, UseGuards} from "@nestjs/common";
import {Crud} from "@nestjsx/crud";
import {Category} from "src/entities/category.entity";
import { AllowToRoles } from "src/misc/allow.to.rolles.descriptor";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";
import {CategoryService} from "src/services/category/category.service";

@Controller('api/category')
@Crud({
    model: {
        type: Category
    },
    params: {
        id: {
            field: 'categoryId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            categories: {
                eager: true
            },
            features: {
                eager: true
            },
            parentCategory: {
                eager: false
            },
            articles: {
                eager: false
            }
        }
    },
    
    routes: {
        only: [
            "createOneBase",
            "createManyBase",
            "updateOneBase",
            "getManyBase",
            "getOneBase",
            
        ],
        createOneBase: {
        decorators: [
            UseGuards(RoleCheckedGuard),
            AllowToRoles('administrator'),
            ],
        },

        createManyBase: {
            decorators: [
                UseGuards(RoleCheckedGuard),
                AllowToRoles('administrator'),
                ],
            },

        updateOneBase: {
            decorators: [
                UseGuards(RoleCheckedGuard),
                AllowToRoles('administrator'),
                ],
            },            

        getManyBase: {
            decorators: [
                UseGuards(RoleCheckedGuard),
                AllowToRoles('administrator', 'user'),
                ],
            },

        getOneBase: {
            decorators: [
                UseGuards(RoleCheckedGuard),
                AllowToRoles('administrator', 'user'),
                ],
            },

    },
})
export class CategoryController {
    constructor(public service: CategoryService){

    }

}