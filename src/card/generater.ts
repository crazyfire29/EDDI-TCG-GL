import {Vector2d} from "../common/math/Vector2d";
import {SupportCardGenerator} from "./support/generate";
import {UnitCardGenerator} from "./unit/generate";
import {ItemCardGenerator} from "./item/generate";
import {EnergyCardGenerator} from "./energy/generate";

export class CardGenerator {
    static async createSupportCard(card: any, positionVector: Vector2d) {
        console.log("Creating support card with data:", card);

        const supportCard = await SupportCardGenerator.createSupportCard(card, positionVector);
        return supportCard
    }

    static async createUnitCard(card: any, positionVector: Vector2d) {
        console.log("Creating a UNIT card:", card);

        const unitCard = await UnitCardGenerator.createUnitCard(card, positionVector)
        return unitCard
    }

    static async createItemCard(card: any, positionVector: Vector2d) {
        console.log("Creating an ITEM card:", card);

        const itemCard = await ItemCardGenerator.createItemCard(card, positionVector)
        return itemCard
    }

    static createTrapCard(card: any, positionVector: Vector2d) {
        console.log("Creating a TRAP card:", card);
    }

    static createToolCard(card: any, positionVector: Vector2d) {
        console.log("Creating a TOOL card:", card);
    }

    static async createEnergyCard(card: any, positionVector: Vector2d) {
        console.log("Creating a ENERGY card:", card);

        const energyCard = await EnergyCardGenerator.createEnergyCard(card, positionVector)
        return energyCard
    }

    static createEnvironmentCard(card: any, positionVector: Vector2d) {
        console.log("Creating a ENVIRONMENT card:", card);
    }

    static createTokenCard(card: any, positionVector: Vector2d) {
        console.log("Creating a TOKEN card:", card);
    }
}