import { Group, Material } from "three";
export declare class GooglyEyes extends Group {
    private readonly _left;
    private readonly _right;
    private readonly _transLeft;
    private readonly _transRight;
    private readonly _whiteLeft;
    private readonly _whiteRight;
    private readonly _irisLeft;
    private readonly _irisRight;
    private _gravity;
    private _friction;
    private _eyeWhiteMaterial;
    private _eyeBlackMaterial;
    private _transparentMaterial;
    constructor(eyeRadius: number, eyeSpacing: number, irisRadius: number, inwardRotation: number, materialType: any);
    get eyeWhiteMaterial(): Material;
    set eyeWhiteMaterial(value: Material);
    get eyeBlackMaterial(): Material;
    get transparentMaterial(): Material;
    set transparentMaterial(value: Material);
    get gravity(): number;
    set gravity(value: number);
    get friction(): number;
    set friction(value: number);
    update(dt: number): void;
}
