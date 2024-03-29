import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/Service/users.service';
import { CreateCategoryDto } from '../Model-Schema/category.dto';
import { Category } from '../Model-Schema/category.model';

@Injectable()
export class CategoryManagementService {

    constructor(
        @InjectModel("Category") private categoryModel: Model<Category>, 
        private userService: UsersService
        ){}

    async index () {
        try {
            const categorys = await this.categoryModel.find().exec();
            
           
            const  categoryss = await categorys.map((category) => ({
                uniq: category.uniq,
                userName: category.userId,
                parent: category.parent,
                title: category.title,
                active: category.active,
            }));
 
            return categoryss;
        } catch (error) {
            throw new NotFoundException()
        }
        
    }

    async create(categoryDto: CreateCategoryDto) {

        try {
            const category =await new this.categoryModel(categoryDto);
            await category.save();
            return "category Created!";
        } catch (error) {
            throw new UnprocessableEntityException();       
        }
        
    }

    async edit(id: string) {

        try {
            const category = await this.categoryModel.findById(id).exec();
            const user = this.getUserName(category.userId);
 
            return {
                uniq: category.uniq,
                userName: (await user).toString(),
                parent: category.parent,
                title: category.title,
                active: category.active
            };
        } catch (error) {
            throw new NotFoundException();
        }
        
    }


    async update(id: string,categoryDto: CreateCategoryDto) {
        try {
            const category = await this.categoryModel.findOneAndUpdate({uniq: id}, categoryDto).exec()
            return "success!";
        } catch (error) {
            throw new NotFoundException();
        }
    }


    async delete(id) {
        try {
             await this.categoryModel.findOneAndDelete({uniq: id});
            return "Cutomer Deleted!";
        } catch (error) {
            throw new NotFoundException();
        }
    }


    protected getUserName (id: string) {
        const user = this.userService.userFullName(id);
        return user;
    }

    async getActiveCategorys () {
        const categorys = await this.categoryModel.find({active: true}).exec();
        return categorys.map(category => ({
            uniq: category.uniq,
            userName: category.userId,
            parent: category.parent,
            title: category.title,
            active: category.active,
        }))
    }
}
