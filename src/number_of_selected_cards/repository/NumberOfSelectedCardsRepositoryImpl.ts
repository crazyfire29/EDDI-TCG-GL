import * as THREE from 'three';
import {NumberOfSelectedCardsRepository} from './NumberOfSelectedCardsRepository';
import {NumberOfSelectedCards} from "../entity/NumberOfSelectedCards";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class NumberOfSelectedCardsRepositoryImpl implements NumberOfSelectedCardsRepository {
    private static instance: NumberOfSelectedCardsRepositoryImpl;
    private numberUniqueIdMap: Map<number, number> = new Map(); // numberUniqueId: cardCount
    private numberMap: Map<number, Map<number, NumberOfSelectedCards>> = new Map(); // cardId: {cardCount: mesh}
    private textureManager: TextureManager;
    private numberGroup: THREE.Group | null = null;

    private readonly NUMBER_WIDTH: number = 0.028
    private readonly NUMBER_HEIGHT: number = 0.034

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): NumberOfSelectedCardsRepositoryImpl {
        if (!NumberOfSelectedCardsRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            NumberOfSelectedCardsRepositoryImpl.instance = new NumberOfSelectedCardsRepositoryImpl(textureManager);
        }
        return NumberOfSelectedCardsRepositoryImpl.instance;
    }

    public async createNumberOfSelectedCards(clickedCardId: number, cardCount: number, position: Vector2d): Promise<NumberOfSelectedCards> {
        const existingCard = this.numberMap.get(clickedCardId);
        if (existingCard) {
            for (const existingNumber of existingCard.values()) {
                this.numberUniqueIdMap.delete(existingNumber.id); // 기존 ID 삭제
            }
        }

        if (this.numberMap.has(clickedCardId)) {
            // 기존 데이터를 삭제
            this.numberMap.delete(clickedCardId);
        }

        const texture = await this.textureManager.getTexture('number_of_selected_cards', cardCount);
        if (!texture) {
            throw new Error(`Texture for Number Of Selected Cards ${cardCount} not found`);
        }

        const numberWidth = this.NUMBER_WIDTH * window.innerWidth;
        const numberHeight = this.NUMBER_HEIGHT * window.innerHeight;

        const numberPositionX = position.getX() * window.innerWidth;
        const numberPositionY = position.getY() * window.innerHeight;

        const numberMesh = MeshGenerator.createMesh(texture, numberWidth, numberHeight, position);
        numberMesh.position.set(numberPositionX, numberPositionY, 0);

        const newNumber = new NumberOfSelectedCards(numberMesh, position);
        this.numberUniqueIdMap.set(newNumber.id, cardCount);

        // 새로운 Map을 생성하고 새로운 값만 저장
        this.numberMap.set(clickedCardId, new Map([[cardCount, newNumber]]));

        return newNumber;
    }

    public findNumberByCardIdAndCardCount(clickedCardId: number, cardCount: number): NumberOfSelectedCards | null {
        return this.numberMap.get(clickedCardId)?.get(cardCount) || null;
    }

    public findAllNumber(): NumberOfSelectedCards[] {
        return Array.from(this.numberMap.values()).flatMap(map => Array.from(map.values()));
    }

    public findAllCardIds(): number[] {
        return Array.from(this.numberMap.keys());
    }

    public findCardCountByCardId(clickedCardId: number): number | null {
        const cardMap = this.numberMap.get(clickedCardId);
        if (!cardMap || cardMap.size === 0) {
            return null;
        }

        // 현재 구조에서는 cardId에 대해 단 하나의 cardCount만 존재하므로 첫 번째 key 반환
        return Array.from(cardMap.keys())[0];
    }

    public findNumberGroup(): THREE.Group {
        if (!this.numberGroup) {
            this.numberGroup = new THREE.Group();
            for (const cardMap of this.numberMap.values()) {
                for (const numberObject of cardMap.values()) {
                    this.numberGroup.add(numberObject.getMesh());
                }
            }
        }
        return this.numberGroup;
    }

    public resetNumberGroup(): void {
        this.numberGroup = null;
    }

    public deleteAllNumber(): void {
        this.numberUniqueIdMap.clear();
        this.numberMap.clear();
    }

    public deleteNumberByCardId(clickedCardId: number): void {
        const existingCard = this.numberMap.get(clickedCardId);
        if (existingCard) {
            for (const existingNumber of existingCard.values()) {
                this.numberUniqueIdMap.delete(existingNumber.id); // 연결된 ID 삭제
            }
        }
        this.numberMap.delete(clickedCardId);
    }

    public hasCardId(clickedCardId: number): boolean {
        return this.numberMap.has(clickedCardId);
    }

    public getNumberMeshByCardId(clickedCardId: number): THREE.Mesh | null {
        const cardMap = this.numberMap.get(clickedCardId);
        if (!cardMap) {
            return null; // 해당 cardId가 없을 경우 null 반환
        }

        // cardMap의 첫 번째 값만 반환
        const numberObject = cardMap.values().next().value;
        return numberObject ? numberObject.getMesh() : null;
    }

}
