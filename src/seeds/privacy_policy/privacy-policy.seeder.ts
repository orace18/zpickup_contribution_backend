import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PrivacyPolicyService } from "src/privacy_policy/privacy_policy.service";
import { PrivacyPolicy, PrivacyPolicyDocument } from "src/Schemas/privacy_policy_schema/privacy_policy.schema";

@Injectable()
export class PrivacyPolicySeeder {
    constructor(
        @InjectModel(PrivacyPolicy.name) private privacyPolicyModel: Model<PrivacyPolicyDocument>,
    ) {}

    async seed() {
        const privacyPolicy = [
            {
                key: 'privacy-policy',
                title: `<h1>Politique de Confidentialité</h1>`,
                description: `
                    <div class="privacy-policy">
                        <h2>1. Collecte des Informations</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                        <h2>2. Utilisation des Données</h2>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                        <h2>3. Protection des Informations</h2>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

                        <h2>4. Vos Droits</h2>
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                        <h2>5. Modifications de la Politique</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                `,
            },
        ];

        const bulkOps = privacyPolicy.map((item) => ({
            updateOne: {
                filter: { key: item.key },
                update: { $set: item },
                upsert: true,
            },
        }));
        await this.privacyPolicyModel.bulkWrite(bulkOps);
    }
}
