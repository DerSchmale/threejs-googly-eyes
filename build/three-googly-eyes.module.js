import { Vector3, Group, SphereBufferGeometry, AdditiveBlending, Mesh, MeshStandardMaterial } from 'three';

const v = new Vector3();
class EyePhysics {
    constructor(target, eyeRadius, irisRadius) {
        this._target = target;
        this._eyeRadius = eyeRadius;
        this._irisRadius = irisRadius;
        this._worldPos = target.getWorldPosition(new Vector3());
        this._oldPos = this._worldPos.clone();
    }
    update(dt, gravity, friction) {
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

class GooglyEyes extends Group {
    constructor(eyeRadius = 0.02, eyeSpacing = 0.05, irisRadius = undefined, inwardRotation = 0.1, materialType) {
        super();
        this._gravity = 0.981;
        this._friction = 0.01;
        materialType = materialType || MeshStandardMaterial;
        irisRadius = irisRadius || eyeRadius * .5;
        const whiteGeom = new SphereBufferGeometry(eyeRadius, 6, 12, Math.PI, Math.PI * 2);
        const blackGeom = new SphereBufferGeometry(irisRadius, 6, 12);
        const transGeom = new SphereBufferGeometry(eyeRadius, 6, 12, 0, Math.PI);
        whiteGeom.scale(1, 1, -0.05);
        blackGeom.scale(1, 1, 0.1);
        transGeom.scale(1, 1, 0.25);
        whiteGeom.computeVertexNormals();
        blackGeom.computeVertexNormals();
        transGeom.computeVertexNormals();
        this._eyeWhiteMaterial = new materialType({ color: 0xffffff, roughness: 0.3 });
        this._eyeBlackMaterial = new materialType({ color: 0x050505, roughness: 0.2 });
        this._transparentMaterial = new materialType({ color: 0x000000, transparent: true, blending: AdditiveBlending, roughness: 0.01 });
        // this._transparentMaterial = new materialType({ color: 0x000000 });
        this._whiteLeft = new Mesh(whiteGeom, this._eyeWhiteMaterial);
        this._whiteRight = new Mesh(whiteGeom, this._eyeWhiteMaterial);
        this._whiteLeft.position.x = -eyeSpacing * .5;
        this._whiteRight.position.x = eyeSpacing * .5;
        this._whiteLeft.rotation.y = inwardRotation;
        this._whiteRight.rotation.y = -inwardRotation;
        this.add(this._whiteLeft);
        this.add(this._whiteRight);
        this._irisLeft = new Mesh(blackGeom, this._eyeBlackMaterial);
        this._irisRight = new Mesh(blackGeom, this._eyeBlackMaterial);
        this._whiteLeft.add(this._irisLeft);
        this._whiteRight.add(this._irisRight);
        this._transLeft = new Mesh(transGeom, this._transparentMaterial);
        this._transRight = new Mesh(transGeom, this._transparentMaterial);
        this._whiteLeft.add(this._transLeft);
        this._whiteRight.add(this._transRight);
        this._left = new EyePhysics(this._irisLeft, eyeRadius, irisRadius);
        this._right = new EyePhysics(this._irisRight, eyeRadius, irisRadius);
    }
    get eyeWhiteMaterial() {
        return this._eyeWhiteMaterial;
    }
    set eyeWhiteMaterial(value) {
        this._eyeWhiteMaterial = value;
        this._whiteLeft.material = value;
        this._whiteRight.material = value;
    }
    get eyeBlackMaterial() {
        return this._eyeBlackMaterial;
    }
    get transparentMaterial() {
        return this._transparentMaterial;
    }
    set transparentMaterial(value) {
        this._transparentMaterial = value;
    }
    get gravity() {
        return this._gravity;
    }
    set gravity(value) {
        this._gravity = value;
    }
    get friction() {
        return this._friction;
    }
    set friction(value) {
        this._friction = value;
    }
    update(dt) {
        this._left.update(dt, this._gravity, this._friction);
        this._right.update(dt, this._gravity, this._friction);
    }
}

export default GooglyEyes;
