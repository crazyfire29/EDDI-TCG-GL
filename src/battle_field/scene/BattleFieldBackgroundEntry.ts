import { BattleFieldBackground } from "../entity/BattleFieldBackground";
import { NonBackgroundImage } from "../../shape/image/NonBackgroundImage";

export interface BattleFieldBackgroundEntry {
    background: BattleFieldBackground;
    image: NonBackgroundImage | null;
}
