import { Mesh, Vector3 } from "three";

const v = new Vector3();

export class EyePhysics
{
    private _irisRadius: number;
    private _eyeRadius: number;
    private _target: Mesh;

    private _worldPos: Vector3;
    private _oldPos: Vector3;

    constructor(target: Mesh, eyeRadius: number, irisRadius: number)
    {
        this._target = target;
        this._eyeRadius = eyeRadius;
        this._irisRadius = irisRadius;
        this._worldPos = target.getWorldPosition(new Vector3());
        this._oldPos = this._worldPos.clone();
    }

    update(dt: number, gravity: number, friction: number)
    {
        const eye = this._target.parent;
        const p = this._worldPos;
        v.subVectors(p, this._oldPos);
        this._oldPos.copy(p);
        v.y -= gravity * dt;
        v.multiplyScalar(1.0 - friction);
        p.add(v);

        eye.worldToLocal(p);

        // clamp p to local plane
        p.z = 0.0;

        const dist = Math.sqrt(p.x * p.x + p.y * p.y);
        const maxDist = this._eyeRadius - this._irisRadius;

        // clamp to own distance
        if (dist > maxDist)
            p.multiplyScalar(maxDist / dist);

        this._target.position.copy(p);
        eye.localToWorld(p);
    }
}