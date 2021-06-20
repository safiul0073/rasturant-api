import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWaiterDto } from '../Model-Schema/waiter.dto';
import { Waiter } from '../Model-Schema/waiter.model';

@Injectable()
export class WaiterManagementService {

    constructor ( @InjectModel("Waiter") private waiterModel: Model<Waiter>) {}

    async index () {
        try {
            const waiters = await this.waiterModel.find().exec();
            return waiters.map((waiter) => ({
                id: waiter.id,
                uniq: waiter.uniq,
                userId: waiter.userId,
                name: waiter.name,
                phone: waiter.phone,
                email: waiter.email,
                address: waiter.address,
                active: waiter.active,
            }));
        } catch (error) {
            throw new NotFoundException()
        }
        
    }

    async create(waterDto: CreateWaiterDto) {

        try {
            const waiter =await new this.waiterModel(waterDto);
            await waiter.save();
            return "waiter Created!";
        } catch (error) {
            throw new UnprocessableEntityException();       
        }
        
    }

    async edit(id: string) {

        try {
            const waiter = await this.waiterModel.findById(id).exec();
            return {
                id: waiter.id,
                uniq: waiter.uniq,
                userId: waiter.userId,
                name: waiter.name,
                phone: waiter.phone,
                email: waiter.email,
                address: waiter.address,
                active: waiter.active,
            };
        } catch (error) {
            throw new NotFoundException();
        }
        
    }


    async update(id: string,waterDto: CreateWaiterDto) {
        try {
            await this.waiterModel.findByIdAndUpdate(id, waterDto).exec()
            return "success!";
        } catch (error) {
            throw new NotFoundException();
        }
    }


    async delete(id) {
        try {
            const waiter = await this.waiterModel.findByIdAndDelete(id);
            return "Waiter Deleted!";
        } catch (error) {
            throw new NotFoundException();
        }
    }
}