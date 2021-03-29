import { Mesh } from "three";
export declare class EyePhysics {
    private _irisRadius;
    private _eyeRadius;
    private _target;
    private _worldPos;
    private _oldPos;
    constructor(target: Mesh, eyeRadius: number, irisRadius: number);
    update(dt: number, gravity: number, friction: number): void;
}
