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
                    <p data-pm-slice="1 1 []"><strong>1. Introduction</strong> Bienvenue sur ZPICKUP, une application mobile d&rsquo;interm&eacute;diation dans le domaine du transport et de la logistique, d&eacute;velopp&eacute;e par WONDER TECK SARL. En utilisant ZPICKUP, vous acceptez les pr&eacute;sentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.</p>
                    <p><strong>2. Objet</strong> Les pr&eacute;sentes conditions d&rsquo;utilisation r&eacute;gissent l&rsquo;acc&egrave;s et l&rsquo;utilisation de l&rsquo;application ZPICKUP, qui permet aux transporteurs et aux clients de se mettre en relation pour faciliter la mobilit&eacute; urbaine et la livraison.</p>
                    <p><strong>3. Acc&egrave;s et Inscription</strong> L&rsquo;acc&egrave;s &agrave; ZPICKUP est r&eacute;serv&eacute; aux utilisateurs remplissant les conditions suivantes :</p>
                    <ul data-spread="false">
                    <li>
                    <p>Avoir au moins 18 ans ou disposer d'une autorisation parentale explicite.</p>
                    </li>
                    <li>
                    <p>Fournir des informations exactes et compl&egrave;tes lors de l&rsquo;inscription.</p>
                    </li>
                    <li>
                    <p>Accepter les pr&eacute;sentes conditions d&rsquo;utilisation.</p>
                    </li>
                    </ul>
                    <p><strong>4. Utilisation de l&rsquo;Application</strong> Les utilisateurs s&rsquo;engagent &agrave; :</p>
                    <ul data-spread="false">
                    <li>
                    <p>Utiliser ZPICKUP uniquement &agrave; des fins licites.</p>
                    </li>
                    <li>
                    <p>Respecter les r&egrave;gles de s&eacute;curit&eacute; et de bonne conduite lors des transactions et interactions.</p>
                    </li>
                    <li>
                    <p>Ne pas utiliser l&rsquo;application &agrave; des fins frauduleuses ou ill&eacute;gales.</p>
                    </li>
                    </ul>
                    <p><strong>5. Responsabilit&eacute;s des Utilisateurs</strong> L&rsquo;utilisateur est responsable :</p>
                    <ul data-spread="false">
                    <li>
                    <p>De l&rsquo;exactitude des informations fournies lors de l&rsquo;inscription.</p>
                    </li>
                    <li>
                    <p>De l&rsquo;usage qu&rsquo;il fait de l&rsquo;application et des transactions effectu&eacute;es.</p>
                    </li>
                    <li>
                    <p>De la protection de ses identifiants de connexion.</p>
                    </li>
                    </ul>
                    <p><strong>6. Obligations des Transporteurs</strong> Les transporteurs utilisant ZPICKUP doivent :</p>
                    <ul data-spread="false">
                    <li>
                    <p>D&eacute;tenir les autorisations et documents l&eacute;gaux requis pour exercer leur activit&eacute;.</p>
                    </li>
                    <li>
                    <p>Assurer la s&eacute;curit&eacute; et la qualit&eacute; du service.</p>
                    </li>
                    <li>
                    <p>Respecter les engagements pris vis-&agrave;-vis des clients.</p>
                    </li>
                    </ul>
                    <p><strong>7. Paiements et Tarification</strong> Les paiements effectu&eacute;s via l&rsquo;application sont r&eacute;glement&eacute;s par les conditions sp&eacute;cifiques de ZPICKUP. Les utilisateurs acceptent que ZPICKUP puisse percevoir une commission sur certaines transactions.</p>
                    <p><strong>8. Annulation et Remboursement</strong> Les conditions d&rsquo;annulation et de remboursement sont d&eacute;finies dans les politiques sp&eacute;cifiques de l&rsquo;application et peuvent varier selon les services souscrits.</p>
                    <p><strong>9. Protection des Donn&eacute;es</strong> ZPICKUP collecte et utilise des donn&eacute;es personnelles conform&eacute;ment &agrave; sa Politique de Confidentialit&eacute;. Les utilisateurs peuvent exercer leurs droits relatifs &agrave; leurs donn&eacute;es personnelles en contactant l&rsquo;assistance.</p>
                    <p><strong>10. Propri&eacute;t&eacute; Intellectuelle</strong> Tous les contenus de l&rsquo;application, y compris les logos, marques et textes, sont la propri&eacute;t&eacute; de WONDER TECK SARL et sont prot&eacute;g&eacute;s par les lois en vigueur sur la propri&eacute;t&eacute; intellectuelle.</p>
                    <p><strong>11. Limitation de Responsabilit&eacute;</strong> ZPICKUP met tout en &oelig;uvre pour assurer un service de qualit&eacute;, mais ne saurait &ecirc;tre tenu responsable des dommages directs ou indirects li&eacute;s &agrave; l&rsquo;utilisation de l&rsquo;application.</p>
                    <p><strong>12. Modification des Conditions</strong> ZPICKUP se r&eacute;serve le droit de modifier ces conditions &agrave; tout moment. Les utilisateurs seront inform&eacute;s des changements et devront accepter les nouvelles conditions pour continuer &agrave; utiliser l&rsquo;application.</p>
                    <p><strong>13. R&eacute;siliation</strong> ZPICKUP peut suspendre ou r&eacute;silier l&rsquo;acc&egrave;s d&rsquo;un utilisateur en cas de violation des pr&eacute;sentes conditions.</p>
                    <p><strong>14. Droit Applicable et Litiges</strong> Les pr&eacute;sentes conditions sont r&eacute;gies par les lois en vigueur au B&eacute;nin. Tout litige sera soumis &agrave; la juridiction comp&eacute;tente.</p>
                    <p><strong>15. Contact</strong> Pour toute question relative aux conditions d&rsquo;utilisation, veuillez contacter notre service client via l&rsquo;application ZPICKUP.</p>
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
