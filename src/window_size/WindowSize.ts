export class UserWindowSize {
    private static instance: UserWindowSize | null = null;

    private prevWidth: number = 0;
    private prevHeight: number = 0
    private currentWidth: number = 0;
    private currentHeight: number = 0;
    private defaultWidth: number = 1848;
    private defaultHeight: number = 949;

    private scaleX: number = 1;
    private scaleY: number = 1;

    private constructor() {
        this.currentWidth = window.innerWidth;
        this.currentHeight = window.innerHeight;

        this.prevWidth = this.defaultWidth
        this.prevHeight = this.defaultHeight

        console.log('UserWindowSize Constructor -> currentWidth, prevWidth:', this.currentWidth, this.prevWidth)
        console.log('UserWindowSize Constructor -> currentHeight, prevHeight:', this.currentHeight, this.prevHeight)

        // this.scaleX = this.currentWidth / this.prevWidth;
        // this.scaleY = this.currentHeight / this.prevHeight;

        this.scaleX = this.currentWidth / this.defaultWidth;
        this.scaleY = this.currentHeight / this.defaultHeight;

        console.log('UserWindowSize Constructor -> scaleX, scaleY:', this.scaleX, this.scaleY)
    }

    public static getInstance(): UserWindowSize {
        if (!UserWindowSize.instance) {
            console.log('window.screen.width:', window.screen.width)
            console.log('document.documentElement.clientWidth:', document.documentElement.clientWidth)
            UserWindowSize.instance = new UserWindowSize();
        }
        return UserWindowSize.instance;
    }

    // 현재 저장된 크기를 반환하는 메서드
    public getSize() {
        return {
            width: this.currentWidth,
            height: this.currentHeight,
        };
    }

    public getWidth(): number {
        return this.currentWidth;
    }

    public getHeight(): number {
        return this.currentHeight;
    }

    public updateSize(width: number, height: number): void {
        this.currentWidth = width;
        this.currentHeight = height;
    }

    public getScaleFactors(): { scaleX: number, scaleY: number } {
        return { scaleX: this.scaleX, scaleY: this.scaleY };
    }

    public calculateScaleFactors(newWidth: number, newHeight: number): void {
        // 너비와 높이가 모두 변경되지 않으면 아무 것도 하지 않음
        if (this.currentWidth === newWidth && this.currentHeight === newHeight) {
            console.log('Window size has not changed, skipping scale calculation.');
            return;
        }

        console.log('UserWindowSize calculateScaleFactors() -> newWidth, prevWidth:', newWidth, this.currentWidth);
        console.log('UserWindowSize calculateScaleFactors() -> newHeight, prevHeight:', newHeight, this.currentHeight);

        // this.scaleX = this.currentWidth / this.defaultWidth;
        // this.scaleY = this.currentHeight / this.defaultHeight;

        // 스케일 계산 및 prev 값 갱신 (변경된 값에 대해서만)
        if (this.currentWidth !== newWidth) {
            // this.scaleX = newWidth / this.currentWidth;
            this.scaleX = newWidth / this.defaultWidth;
            this.prevWidth = this.currentWidth;  // 너비가 변경된 경우에만 갱신
            this.currentWidth = newWidth;        // 새로운 너비 값으로 갱신
        }

        if (this.currentHeight !== newHeight) {
            // this.scaleY = newHeight / this.currentHeight;
            this.scaleY =  newHeight / this.defaultHeight;
            this.prevHeight = this.currentHeight; // 높이가 변경된 경우에만 갱신
            this.currentHeight = newHeight;       // 새로운 높이 값으로 갱신
        }

        console.log('UserWindowSize calculateScaleFactors() -> scaleX, scaleY:', this.scaleX, this.scaleY);
    }

    // public calculateScaleFactors(newWidth: number, newHeight: number): void {
    //     // 너비와 높이가 모두 변경되지 않으면 아무 것도 하지 않음
    //     if (this.currentWidth === newWidth && this.currentHeight === newHeight) {
    //         console.log('Window size has not changed, skipping scale calculation.');
    //         return;
    //     }
    //
    //     // 현재 비율
    //     const currentAspect = this.currentWidth / this.currentHeight;
    //     // 새 비율
    //     const newAspect = newWidth / newHeight;
    //
    //     // 스케일 계산
    //     if (this.currentWidth !== newWidth) {
    //         this.scaleX = newWidth / this.defaultWidth;
    //     }
    //
    //     if (this.currentHeight !== newHeight) {
    //         this.scaleY = newHeight / this.defaultHeight;
    //     }
    //
    //     // Aspect 비율에 따라 scaleX와 scaleY 조정
    //     if (currentAspect !== newAspect) {
    //         if (currentAspect > newAspect) {
    //             // 현재 비율이 새 비율보다 크면 X 방향의 스케일이 더 커야 함
    //             this.scaleY = this.scaleX * (newAspect / currentAspect);
    //         } else {
    //             // 현재 비율이 새 비율보다 작으면 Y 방향의 스케일이 더 커야 함
    //             this.scaleX = this.scaleY * (currentAspect / newAspect);
    //         }
    //     }
    //
    //     // 이전 값 갱신
    //     this.prevWidth = this.currentWidth;
    //     this.prevHeight = this.currentHeight;
    //
    //     // 현재 크기 갱신
    //     this.currentWidth = newWidth;
    //     this.currentHeight = newHeight;
    //
    //     console.log('UserWindowSize calculateScaleFactors() -> scaleX, scaleY:', this.scaleX, this.scaleY);
    // }

    public getDefaultWidth(): number {
        return this.defaultWidth;
    }

    public getDefaultHeight(): number {
        return this.defaultHeight;
    }
}
