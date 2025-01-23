export class InputContainerGenerator {
    public static createInputContainer(
        placeholder: string,
        containerWidth: number, containerHeight: number, containerPosition: { top: number, left: number },
        inputWidth: number, inputHeight: number, inputFontSize: number,
        maxLength: number
    ): HTMLDivElement {
        // 컨테이너 생성
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'absolute';
        inputContainer.style.top = `${containerPosition.top}px`;
        inputContainer.style.left = `${containerPosition.left}px`;
        inputContainer.style.width = `${containerWidth}px`;
        inputContainer.style.height = `${containerHeight}px`;
        inputContainer.style.zIndex = '10';
        inputContainer.style.display = 'none'; // 처음에는 보이지 않음 'none'

        // 입력창 생성
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = placeholder;
        inputElement.style.width = `${inputWidth}px`;
        inputElement.style.height = `${inputHeight}px`;
        inputElement.style.fontSize = `${inputFontSize}px`;
        inputElement.style.padding = '12px';

        inputElement.maxLength = maxLength;

        // 요소 컨테이너에 추가
        inputContainer.appendChild(inputElement);

        // 전체 컨테이너 반환
        document.body.appendChild(inputContainer);
        return inputContainer;
    }

    public static setContainerVisible(inputContainer: HTMLDivElement, displayState: 'block' | 'none'): void {
        inputContainer.style.display = displayState;
    }
}
