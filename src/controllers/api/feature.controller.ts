import {Controller, UseGuards} from "@nestjs/common";
import {Crud} from "@nestjsx/crud";
import {Feature} from "src/entities/feature.entity";
import { AllowToRoles } from "src/misc/allow.to.rolles.descriptor";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";
import { FeatureService } from "src/services/feature/feature.service";


@Controller('api/feature')
@Crud({
    model: {
        type: Feature
    },
    params: {
        id: {
            field: 'featureId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            category: {
                eager: true
            },
            articleFeatures: {
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
export class FeatureController {
    constructor(public service: FeatureService){

    }

}