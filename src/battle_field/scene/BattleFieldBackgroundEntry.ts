import { BattleFieldBackground } from "../entity/BattleFieldBackground";
import { LegacyNonBackgroundImage } from "../../shape/image/LegacyNonBackgroundImage";

export interface BattleFieldBackgroundEntry {
    background: BattleFieldBackground;
    image: LegacyNonBackgroundImage | null;
}
