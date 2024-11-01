import {Model} from "mongoose";

export async function generateUniqueString(model: Model<any>,column:string,prefixe:string): Promise<string> {
    let code;
    let isUnique = false;
    while (!isUnique) {
        code = `${prefixe}-${Math.floor(100000 + Math.random() * 900000).toString()}`;
        const existingUser = await model.find({ column:code }).exec();
        if (existingUser.length==0) {
            isUnique = true;
        }
    }
    return code;
}