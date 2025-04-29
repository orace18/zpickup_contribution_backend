import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FAQ, FAQDocument } from "src/Schemas/FAQ_schema/FAQ.schema";

@Injectable()
export class FaqSeeder {
    constructor(
        @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    ) {}

    async faqSeed() {
        const faq_tabs = [
            {
                key: 'bonus-faq',
                title: 'Comment sont calculés les gains sur une course effectué?',
                description: 'On fait le calcul en fonction de la distance parcourue et du pourcentage de gain de la zone',
            },
            {
                key: 'test-faq',
                title: 'Test de FAQ?',
                description: 'Rien tout est cool',
            },
        ];

        const bulkOps = faq_tabs.map((item) => ({
            updateOne: {
                filter: { key: item.key },
                update: { $set: item },
                upsert: true,
            },
        }));
        await this.faqModel.bulkWrite(bulkOps);
    }
}