import { BattleFieldUnit } from "../entity/BattleFieldUnit";
import { NonBackgroundImage } from "../../shape/image/NonBackgroundImage";

export interface BattleFieldUnitEntry {
    unit: BattleFieldUnit;
    card: NonBackgroundImage | null;
    weapon: NonBackgroundImage | null;
    hp: NonBackgroundImage | null;
    energy: NonBackgroundImage | null;
    race: NonBackgroundImage | null;
}