import { MouseCursorDetectArea } from "./MouseCursorDetectArea";

export class MouseCursorDetectAreaMap {
    private areaBounds: Record<MouseCursorDetectArea, { x1: number; y1: number; x2: number; y2: number }>;

    constructor() {
        this.areaBounds = {
            // Mouse clicked at: (576, 906), (1275, 713) <=> 1848, 929
            [MouseCursorDetectArea.YOUR_HAND]: { x1: 0.311688, y1: 0.767491, x2: 0.689935, y2: 0.975242 },
            [MouseCursorDetectArea.YOUR_FIELD]: { x1: 50, y1: 500, x2: 950, y2: 700 },
            [MouseCursorDetectArea.YOUR_TOMB]: { x1: 20, y1: 600, x2: 120, y2: 700 },
            [MouseCursorDetectArea.YOUR_LOSTZONE]: { x1: 880, y1: 600, x2: 980, y2: 700 },
            [MouseCursorDetectArea.YOUR_CONSTRUCTION]: { x1: 400, y1: 600, x2: 600, y2: 700 },

            [MouseCursorDetectArea.OPPONENT_HAND]: { x1: 50, y1: 50, x2: 950, y2: 250 },
            [MouseCursorDetectArea.OPPONENT_FIELD]: { x1: 50, y1: 300, x2: 950, y2: 500 },
            [MouseCursorDetectArea.OPPONENT_TOMB]: { x1: 20, y1: 200, x2: 120, y2: 300 },
            [MouseCursorDetectArea.OPPONENT_LOSTZONE]: { x1: 880, y1: 200, x2: 980, y2: 300 },
            [MouseCursorDetectArea.OPPONENT_CONSTRUCTION]: { x1: 400, y1: 200, x2: 600, y2: 300 },

            [MouseCursorDetectArea.ENVIRONMENT]: { x1: 300, y1: 400, x2: 700, y2: 600 },
            [MouseCursorDetectArea.SETTINGS]: { x1: 850, y1: 900, x2: 950, y2: 980 },
            [MouseCursorDetectArea.TURN_END]: { x1: 750, y1: 900, x2: 830, y2: 980 },
        };
    }

    public getAbsoluteBounds(area: MouseCursorDetectArea): { x1: number; y1: number; x2: number; y2: number } | null {
        const bounds = this.areaBounds[area];

        if (!bounds) return null;

        if (area === MouseCursorDetectArea.YOUR_HAND) {
            return {
                x1: bounds.x1 * window.innerWidth,
                y1: bounds.y1 * window.innerHeight,
                x2: bounds.x2 * window.innerWidth,
                y2: bounds.y2 * window.innerHeight,
            };
        }

        return bounds;
    }
}
