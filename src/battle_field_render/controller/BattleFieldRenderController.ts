// import {BackgroundService} from "../../background/service/BackgroundService";
// import {BackgroundType} from "../../background/entity/BackgroundType";
//
// export class BattleFieldRenderController {
//     private backgroundService: BackgroundService;
//     private BattleFieldRenderService: BattleFieldRenderService;
//
//     constructor(backgroundService: BackgroundService, BattleFieldRenderService: BattleFieldRenderService) {
//         this.backgroundService = backgroundService;
//         this.BattleFieldRenderService = BattleFieldRenderService;
//     }
//
//     // 배경을 생성하고 렌더링
//     public async renderBattleField(): Promise<void> {
//         const battleFieldBackground = await this.backgroundService.createBackground(
//             'battle_field_background',
//             BackgroundType.BATTLE_FIELD,
//             window.innerWidth,
//             window.innerHeight,);
//         // this.battleFieldRenderer.render(battleField);
//     }
//
//     // 배틀 필드에 있는 객체들을 렌더링
//     public async renderObjects(): Promise<void> {
//         // const objects = await this.battleFieldService.getBattleObjects();
//         // this.battleFieldRenderer.renderObjects(objects);
//     }
// }
