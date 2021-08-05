import * as mongoose from 'mongoose'
export const TableSchema = new mongoose.Schema({

     uniq: {type: String},
     userId: {type: String},
     storeId: {type: String},
     title: {type: String},
     capacity: {type: String},
     available_status: {type: Boolean},
})