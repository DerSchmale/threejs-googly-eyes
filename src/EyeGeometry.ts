import { BufferGeometry, SphereBufferGeometry } from "three";

export class EyeGeometry extends BufferGeometry
{
    constructor(radius: number, numSegmentsW: number, numSegmentsH: number, scaleZ: number = 1.0)
    {
        super();
    }
}