import { getCardById } from "../../src/card/utility";
import { CardRace } from "../../src/card/race";
import {CardGrade} from "../../src/card/grade";
import {CardKind} from "../../src/card/kind";
import {TextureManager} from "../../src/texture_manager/TextureManager";

async function main() {
    const textureManager = TextureManager.getInstance();
    await textureManager.preloadTextures("image-paths.json");

    const cardIdToFind = 2;
    const card = getCardById(cardIdToFind);

    if (card) {
        const damage = card.공격력;
        const hp = card.체력 !== null ? card.체력 : "No HP specified";
        const race = CardRace[parseInt(card.종족, 10)] as keyof typeof CardRace;
        const gradeInt = parseInt(card.등급, 10)
        const grade = CardGrade[gradeInt] as keyof typeof CardGrade
        const kind = CardKind[parseInt(card.종류, 10)] as keyof typeof CardKind;
        const requiredEnergy = card.필요_에너지;

        console.log('Card found:');
        console.log('공격력:', damage);
        console.log('체력:', hp);
        console.log('종족:', race);
        console.log('등급:', grade);
        console.log('종류:', kind);
        console.log('필요_에너지:', requiredEnergy);
        console.log('type(필요_에너지):', typeof requiredEnergy);

        const currentCardKinds = await textureManager.getTexture('card_kinds', gradeInt);
        console.log("currentCardKinds:", currentCardKinds);

        const currentCardDefaultEnergy = await textureManager.getTexture('energy', requiredEnergy);
        console.log("currentCardDefaultEnergy:", currentCardDefaultEnergy);
    } else {
        console.log('Card not found');
    }
}

main().catch(console.error);
