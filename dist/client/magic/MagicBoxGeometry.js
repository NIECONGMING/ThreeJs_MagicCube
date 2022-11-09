import * as THREE from '/build/three.module.js';
export class FACE3 {
    constructor(a, b, c, normal, color, materialIndex = 0) {
        this._a = a;
        this._b = b;
        this._c = c;
        this._normal = new THREE.Vector3();
        this._vertexNormals = Array.isArray(normal) ? normal : [];
        this._color = new THREE.Color();
        this._vertexColors = Array.isArray(color) ? color : [];
        this._materialIndex = materialIndex !== undefined ? materialIndex : 0;
    }
    get a() {
        return this._a;
    }
    set a(value) {
        this._a = value;
    }
    get b() {
        return this._b;
    }
    set b(value) {
        this._b = value;
    }
    get c() {
        return this._c;
    }
    set c(value) {
        this._c = value;
    }
    get normal() {
        return this._normal;
    }
    set normal(value) {
        this._normal = value;
    }
    get color() {
        return this._color;
    }
    set color(val) {
        this.color = val;
    }
}
export class MagicBoxGeometry extends THREE.BoxGeometry {
    constructor(width, height, depth, widthSegments, heightSegments, depthSegments) {
        super(width, height, depth, widthSegments, heightSegments, depthSegments);
        this._faceVertexUvs = [];
        this._vertices = new Array();
        this._colors = new Array();
        this._faces = new Array();
        this._faceVertexUvs = new Array();
        let bufferBox = new THREE.BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
        this.fromBufferGeometry(bufferBox);
        this.mergeVertices();
    }
    // private set faceVertexUvs(uv:Array<THREE.Vector2[]>)
    // {
    //     this._faceVertexUvs = uv;
    // }
    get faceVertexUvs() {
        return this._faceVertexUvs;
    }
    set vertices(vec) {
        this._vertices = vec;
    }
    get vertices() {
        return this._vertices;
    }
    set colors(vec) {
        this._colors = vec;
    }
    get colors() {
        return this._colors;
    }
    // public set faces(face:FACE3)
    // {
    //     this._faces = face;
    // }
    get faces() {
        return this._faces;
    }
    fromBufferGeometry(geometry) {
        let scope = this;
        let indices = geometry.index !== null ? geometry.index.array : undefined;
        let attributes = geometry.attributes;
        let positions = attributes.position.array;
        let normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
        let colors = attributes.color !== undefined ? attributes.color.array : undefined;
        let uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
        let uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;
        if (uvs2 !== undefined)
            this.faceVertexUvs[1] = new Array; //[];
        let tempNormals = [];
        let tempUVs = [];
        let tempUVs2 = [];
        for (var i = 0, j = 0; i < positions.length; i += 3, j += 2) {
            this.vertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
            if (normals !== undefined) {
                tempNormals.push(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]));
            }
            if (colors !== undefined) {
                this.colors.push(new THREE.Color(colors[i], colors[i + 1], colors[i + 2]));
            }
            if (uvs !== undefined) {
                tempUVs.push(new THREE.Vector2(uvs[j], uvs[j + 1]));
            }
            if (uvs2 !== undefined) {
                tempUVs2.push(new THREE.Vector2(uvs2[j], uvs2[j + 1]));
            }
        }
        let addFace = (a, b, c, materialIndex = 0) => {
            let vertexNormals = normals !== undefined ? [tempNormals[a].clone(), tempNormals[b].clone(), tempNormals[c].clone()] : [];
            let vertexColors = colors !== undefined ? [scope.colors[a].clone(), scope.colors[b].clone(), scope.colors[c].clone()] : [];
            let face = new FACE3(a, b, c, vertexNormals, vertexColors, materialIndex);
            this.faces.push(face);
            if (uvs !== undefined) {
                let arV = new Array;
                arV.push([tempUVs[a].clone(), tempUVs[b].clone(), tempUVs[c].clone()]);
                scope.faceVertexUvs.push(arV);
                // scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );
            }
            if (uvs2 !== undefined) {
                scope.faceVertexUvs[1].push([tempUVs2[a].clone(), tempUVs2[b].clone(), tempUVs2[c].clone()]);
            }
        };
        let groups = geometry.groups;
        if (groups.length > 0) {
            for (let i = 0; i < groups.length; i++) {
                let group = groups[i];
                let start = group.start;
                let count = group.count;
                for (let j = start, jl = start + count; j < jl; j += 3) {
                    if (indices !== undefined) {
                        addFace(indices[j], indices[j + 1], indices[j + 2], group.materialIndex);
                    }
                    else {
                        addFace(j, j + 1, j + 2, group.materialIndex);
                    }
                }
            }
        }
        else {
            if (indices !== undefined) {
                for (var i = 0; i < indices.length; i += 3) {
                    addFace(indices[i], indices[i + 1], indices[i + 2]);
                }
            }
            else {
                for (var i = 0; i < positions.length / 3; i += 3) {
                    addFace(i, i + 1, i + 2);
                }
            }
        }
        this.computeFaceNormals();
        if (geometry.boundingBox !== null) {
            this.boundingBox = geometry.boundingBox.clone();
        }
        if (geometry.boundingSphere !== null) {
            this.boundingSphere = geometry.boundingSphere.clone();
        }
        return this;
    }
    mergeVertices() {
        let verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
        let unique = [], changes = [];
        let v, key;
        let precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
        let precision = Math.pow(10, precisionPoints);
        let i, il, face;
        let indices, j, jl;
        for (i = 0, il = this.vertices.length; i < il; i++) {
            v = this.vertices[i];
            key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);
            if (verticesMap[key] === undefined) {
                verticesMap[key] = i;
                unique.push(this.vertices[i]);
                changes[i] = unique.length - 1;
            }
            else {
                //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
                changes[i] = changes[verticesMap[key]];
            }
        }
        // if faces are completely degenerate after merging vertices, we
        // have to remove them from the geometry.
        var faceIndicesToRemove = [];
        for (i = 0, il = this.faces.length; i < il; i++) {
            face = this.faces[i];
            face.a = changes[face.a];
            face.b = changes[face.b];
            face.c = changes[face.c];
            indices = [face.a, face.b, face.c];
            // if any duplicate vertices are found in a Face3
            // we have to remove the face as nothing can be saved
            for (var n = 0; n < 3; n++) {
                if (indices[n] === indices[(n + 1) % 3]) {
                    faceIndicesToRemove.push(i);
                    break;
                }
            }
        }
        for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {
            var idx = faceIndicesToRemove[i];
            this.faces.splice(idx, 1);
            for (j = 0, jl = this.faceVertexUvs.length; j < jl; j++) {
                this.faceVertexUvs[j].splice(idx, 1);
            }
        }
        // Use unique set of vertices
        var diff = this.vertices.length - unique.length;
        this.vertices = unique;
        return diff;
    }
    computeFaceNormals() {
        let cb = new THREE.Vector3(), ab = new THREE.Vector3();
        for (let f = 0, fl = this.faces.length; f < fl; f++) {
            let face = this.faces[f];
            let vA = this.vertices[face.a];
            let vB = this.vertices[face.b];
            let vC = this.vertices[face.c];
            cb.subVectors(vC, vB);
            ab.subVectors(vA, vB);
            cb.cross(ab);
            cb.normalize();
            face.normal.copy(cb);
        }
    }
}
