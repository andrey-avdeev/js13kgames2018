/**
 * Meta information for usage inside game objects.
 */
export class RenderingMeta {
    constructor(
        public canvas: HTMLCanvasElement,
        public context: CanvasRenderingContext2D
    ) {
    }
}