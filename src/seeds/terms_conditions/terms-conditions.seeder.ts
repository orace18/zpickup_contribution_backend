import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TermsConditions, TermsConditionsDocument } from "src/Schemas/terms_conditions_schema/terms_conditions.schema";

@Injectable()
export class TermsConditionsSeeder {
    constructor(
        @InjectModel(TermsConditions.name) private termsConditionsModel: Model<TermsConditionsDocument>,
    ) {}    

    async seed() {
        const termsConditions = [
            {
                key: 'terms-conditions',
                title: `<h1>Termes et Conditions d'Utilisation</h1>`,
                description: `
                    <div class="terms-conditions">
                        <h2>1. Acceptation des Conditions</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                        <h2>2. Services Proposés</h2>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                        <h2>3. Responsabilités des Utilisateurs</h2>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

                        <h2>4. Propriété Intellectuelle</h2>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                        <h2>5. Modification des Services</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>

                        <h2>6. Résiliation</h2>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                `,
            },  
        ];

        const bulkOps = termsConditions.map((item) => ({
            updateOne: {
                filter: { key: item.key },
                update: { $set: item },
                upsert: true,
            },
        }));

        await this.termsConditionsModel.bulkWrite(bulkOps);
    }
}
