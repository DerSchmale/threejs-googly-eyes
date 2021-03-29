import { AdditiveBlending, Group, Material, Mesh, MeshStandardMaterial, SphereBufferGeometry } from "three";
import { EyePhysics } from "./EyePhysics";

/**
 * GooglyEyes provides a ThreeJS Group containing, well, Googly Eyes!
 */
export class GooglyEyes extends Group
{
    private readonly _left: EyePhysics;
    private readonly _right: EyePhysics;

    private readonly _transLeft: Mesh;
    private readonly _transRight: Mesh;
    private readonly _whiteLeft: Mesh;
    private readonly _whiteRight: Mesh;
    private readonly _irisLeft: Mesh;
    private readonly _irisRight: Mesh;

    private _gravity: number = 0.981;
    private _friction: number = 0.01;

    private _eyeWhiteMaterial: Material;
    private _irisMaterial: Material;
    private _transparentMaterial: Material;

    /**
     * Creates a new GooglyEyes object.
     * @param eyeRadius The radius of the eyes.
     * @param eyeSpacing The spacing of the eyes from the center.
     * @param irisRadius The radius of the iris.
     * @param inwardRotation The inward rotation of the eyes.
     * @param materialType A reference to the class for the material. Defaults to MeshStandardMaterial.
     */
    constructor(eyeRadius: number = 0.02, eyeSpacing: number = 0.05, irisRadius: number = undefined, inwardRotation: number = 0.1, materialType: any = MeshStandardMaterial)
    {
        super();

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
        this._irisMaterial = new materialType({ color: 0x050505, roughness: 0.2 });
        this._transparentMaterial = new materialType({
            color: 0x000000,
            transparent: true,
            blending: AdditiveBlending,
            roughness: 0.01
        });
        // this._transparentMaterial = new materialType({ color: 0x000000 });

        this._whiteLeft = new Mesh(whiteGeom, this._eyeWhiteMaterial);
        this._whiteRight = new Mesh(whiteGeom, this._eyeWhiteMaterial);
        this._whiteLeft.position.x = -eyeSpacing * .5;
        this._whiteRight.position.x = eyeSpacing * .5;

        this._whiteLeft.rotation.y = inwardRotation;
        this._whiteRight.rotation.y = -inwardRotation;

        this.add(this._whiteLeft);
        this.add(this._whiteRight);

        this._irisLeft = new Mesh(blackGeom, this._irisMaterial);
        this._irisRight = new Mesh(blackGeom, this._irisMaterial);
        this._whiteLeft.add(this._irisLeft);
        this._whiteRight.add(this._irisRight);

        this._transLeft = new Mesh(transGeom, this._transparentMaterial);
        this._transRight = new Mesh(transGeom, this._transparentMaterial);

        this._whiteLeft.add(this._transLeft);
        this._whiteRight.add(this._transRight);

        this._left = new EyePhysics(this._irisLeft, eyeRadius, irisRadius);
        this._right = new EyePhysics(this._irisRight, eyeRadius, irisRadius);
    }

    /**
     * The material to render the white part of the eyes.
     */
    get eyeWhiteMaterial(): Material
    {
        return this._eyeWhiteMaterial;
    }

    set eyeWhiteMaterial(value: Material)
    {
        this._eyeWhiteMaterial = value;
        this._whiteLeft.material = value;
        this._whiteRight.material = value;
    }

    /**
     * The material to render the black part of the eyes (iris).
     */
    get irisMaterial(): Material
    {
        return this._irisMaterial;
    }

    /**
     * The material to render the black part of the eyes (iris).
     */
    set irisMaterial(value: Material)
    {
        this._irisMaterial = value;
        this._irisLeft.material = value;
        this._irisRight.material = value;
    }

    /**
     * The material to render the transparent cap.
     */
    get transparentMaterial(): Material
    {
        return this._transparentMaterial;
    }

    set transparentMaterial(value: Material)
    {
        this._transparentMaterial = value;
        this._transLeft.material = value;
        this._transRight.material = value;
    }

    /**
     * The gravity to apply to the iris. Defaults to 9.81
     */
    get gravity()
    {
        return this._gravity;
    }

    set gravity(value: number)
    {
        this._gravity = value;
    }

    /**
     * The friction coefficient to apply to the movement. Defaults to 0.01.
     */
    get friction(): number
    {
        return this._friction;
    }

    set friction(value: number)
    {
        this._friction = value;
    }

    /**
     * Updates the googly eyes. Needs to be called every frame.
     * @param dt The amount of seconds since the last update.
     */
    update(dt: number)
    {
        this._left.update(dt, this._gravity, this._friction);
        this._right.update(dt, this._gravity, this._friction);
    }
}