import {NeonBorderStatus} from "./NeonBorderStatus";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class NeonBorder {
    id: number;
    neonBorderLineSceneIdList: number[];
    neonBorderLinePositionIdList: number[];
    status: NeonBorderStatus;

    constructor(
        neonBorderLineSceneIdList: number[],
        neonBorderLinePositionIdList: number[],
        status: NeonBorderStatus = NeonBorderStatus.ACTIVE
    ) {
        this.id = IdGenerator.generateId("NeonBorder");
        this.neonBorderLineSceneIdList = neonBorderLineSceneIdList;
        this.neonBorderLinePositionIdList = neonBorderLinePositionIdList;
        this.status = status;
    }

    getId(): number {
        return this.id;
    }

    getNeonBorderLineSceneIdList(): number[] {
        return this.neonBorderLineSceneIdList;
    }

    getNeonBorderLinePositionIdList(): number[] {
        return this.neonBorderLinePositionIdList;
    }

    getStatus(): NeonBorderStatus {
        return this.status;
    }

    setStatus(newStatus: NeonBorderStatus): void {
        this.status = newStatus;
    }
}