
import * as THREE from '/build/three.module.js'
import { Face } from '/build/three.module.js';
export class FACE3
{
    private _a :number;
    private _b :number;
    private _c :number; 
    private _normal:THREE.Vector3;
    private _color:THREE.Color;
    private _materialIndex:number;
    private _vertexNormals:THREE.Vector3[];
    private _vertexColors:THREE.Color[];

    constructor( a:number, b:number, c:number, normal:THREE.Vector3[], color:THREE.Color[], materialIndex:number = 0 ) {

		this._a = a;
		this._b = b;
		this._c = c;

		this._normal = new THREE.Vector3();
		this._vertexNormals = Array.isArray( normal ) ? normal : [];

		this._color = new THREE.Color();
		this._vertexColors = Array.isArray( color ) ? color : [];

		this._materialIndex = materialIndex !== undefined ? materialIndex : 0;

	}

    public get a()
    {
        return this._a
    }
    public set a(value:number)
    {
        this._a = value;
    }

    public get b()
    {
        return this._b
    }

    public set b(value:number)
    {
        this._b = value;
    }

    public get c()
    {
        return this._c
    }

    public set c(value:number)
    {
        this._c = value;
    }

    public get normal()
    {
        return this._normal
    }

    public set normal(value:THREE.Vector3)
    {
        this._normal = value;
    }

    public get color()
    {
        return this._color;
    }

    public set color(val:THREE.Color)
    {
        this.color  = val;
    }
}

export class MagicBoxGeometry extends THREE.BoxGeometry
{
    private _faceVertexUvs:Array< Array<THREE.Vector2[]> > =[];
    private _vertices:THREE.Vector3[];
    private _colors:THREE.Color[];
    private _faces:FACE3[];
    constructor(        
        width?: number,
        height?: number,
        depth?: number,
        widthSegments?: number,
        heightSegments?: number,
        depthSegments?: number,)
    {
        super(width,height,depth,widthSegments,heightSegments,depthSegments);
        this._vertices = new Array< THREE.Vector3>();
        this._colors = new Array<THREE.Color>();
        this._faces = new Array<FACE3>();
        this._faceVertexUvs = new Array< Array<THREE.Vector2[]> >() ;

        let bufferBox = new THREE.BoxBufferGeometry(width,height,depth,widthSegments,heightSegments,depthSegments);

        this.fromBufferGeometry(bufferBox);
        this.mergeVertices();
    }

    // private set faceVertexUvs(uv:Array<THREE.Vector2[]>)
    // {
    //     this._faceVertexUvs = uv;
    // }

    private get faceVertexUvs()
    {
        return this._faceVertexUvs;
    }
    private set vertices(vec:THREE.Vector3[])
    {
        this._vertices = vec;
    }

    private get vertices()
    {
        return this._vertices ;
    }

    private set colors(vec:THREE.Color[])
    {
        this._colors = vec;
    }

    public get colors()
    {
        return this._colors;
    }
    // public set faces(face:FACE3)
    // {
    //     this._faces = face;
    // }
    public get faces()
    {
        return this._faces;
    }

    private fromBufferGeometry ( geometry:any ) {

        let scope = this;
    
        let indices = geometry.index !== null ? geometry.index.array : undefined;
        let attributes = geometry.attributes;
    
        let positions = attributes.position.array;
        let normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
        let colors = attributes.color !== undefined ? attributes.color.array : undefined;
        let uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
        let uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;
    
        if ( uvs2 !== undefined ) this.faceVertexUvs[ 1 ] = new Array<THREE.Vector2[]>  //[];
    
        let tempNormals = [];
        let tempUVs:Array< THREE.Vector2> = [];
        let tempUVs2 = [];
    
        for ( var i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {
    
            this.vertices.push( new THREE.Vector3( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] ) );
    
            if ( normals !== undefined ) {
    
                tempNormals.push( new THREE.Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );
    
            }
    
            if ( colors !== undefined ) {
    
                this.colors.push( new THREE.Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );
    
            }
    
            if ( uvs !== undefined ) {
    
                tempUVs.push( new THREE.Vector2( uvs[ j ], uvs[ j + 1 ] ) );
    
            }
    
            if ( uvs2 !== undefined ) {
    
                tempUVs2.push( new THREE.Vector2( uvs2[ j ], uvs2[ j + 1 ] ) );
    
            }
    
        }
    
        let addFace:Function = ( a:number, b:number, c:number, materialIndex:number = 0 )=> {
    
            let vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
            let vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];
    
            let face = new FACE3( a, b, c, vertexNormals, vertexColors, materialIndex );
    
            this.faces.push( face );
    
            if ( uvs !== undefined ) {
    
                let arV = new Array<THREE.Vector2[]>;
                arV.push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ]);
                
                scope.faceVertexUvs.push(arV);
                // scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );
    
            }
    
            if ( uvs2 !== undefined ) 
            {

                scope.faceVertexUvs[ 1 ].push( [ tempUVs2[ a ].clone(), tempUVs2[ b ].clone(), tempUVs2[ c ].clone() ] );
    
            }
    
        }
    
        let groups = geometry.groups;
    
        if ( groups.length > 0 ) {
    
            for ( let i = 0; i < groups.length; i ++ ) {
    
                let group = groups[ i ];
    
                let start = group.start;
                let count = group.count;
    
                for ( let j = start, jl = start + count; j < jl; j += 3 ) {
    
                    if ( indices !== undefined ) {
    
                        addFace( indices[ j ], indices[ j + 1 ], indices[ j + 2 ], group.materialIndex );
    
                    } else {
    
                        addFace( j, j + 1, j + 2, group.materialIndex );
    
                    }
    
                }
    
            }
    
        } 
        else {
    
            if ( indices !== undefined ) 
            {
                for ( var i = 0; i < indices.length; i += 3 ) {
    
                    addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );
    
                }
    
            } else 
            {
    
                for ( var i = 0; i < positions.length / 3; i += 3 ) 
                {
    
                    addFace( i, i + 1, i + 2 );
    
                }
            }
    
        }
    
        this.computeFaceNormals();
    
        if ( geometry.boundingBox !== null ) {
    
            this.boundingBox = geometry.boundingBox.clone();
    
        }
    
        if ( geometry.boundingSphere !== null ) {
    
            this.boundingSphere = geometry.boundingSphere.clone();
    
        }
    
        return this;
    
    }


    public mergeVertices(){

        let verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
        let unique = [], changes = [];

        let v, key;
        let precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
        let precision = Math.pow( 10, precisionPoints );
        let i, il, face;
        let indices, j, jl;

        for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

            v = this.vertices[ i ];
            key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

            if ( verticesMap[ key ] === undefined ) {

                verticesMap[ key ] = i;
                unique.push( this.vertices[ i ] );
                changes[ i ] = unique.length - 1;

            } else {

                //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
                changes[ i ] = changes[ verticesMap[ key ] ];

            }

        }


        // if faces are completely degenerate after merging vertices, we
        // have to remove them from the geometry.
        var faceIndicesToRemove = [];

        for ( i = 0, il = this.faces.length; i < il; i ++ ) {

            face = this.faces[ i ];

            face.a = changes[ face.a ];
            face.b = changes[ face.b ];
            face.c = changes[ face.c ];

            indices = [ face.a, face.b, face.c ];

            // if any duplicate vertices are found in a Face3
            // we have to remove the face as nothing can be saved
            for ( var n = 0; n < 3; n ++ ) {

                if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

                    faceIndicesToRemove.push( i );
                    break;

                }

            }

        }

        for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

            var idx = faceIndicesToRemove[ i ];

            this.faces.splice( idx, 1 );

            for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

                this.faceVertexUvs[ j ].splice( idx, 1 );

            }

        }

        // Use unique set of vertices

        var diff = this.vertices.length - unique.length;
        this.vertices = unique;
        return diff;

    }


    public computeFaceNormals () 
    {

        let cb = new THREE.Vector3(), ab = new THREE.Vector3();

        for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

            let face:FACE3 = this.faces[ f ];

            let vA = this.vertices[ face.a ];
            let vB = this.vertices[ face.b ];
            let vC = this.vertices[ face.c ];

            cb.subVectors( vC, vB );
            ab.subVectors( vA, vB );
            cb.cross( ab );

            cb.normalize();

            face.normal.copy( cb );

        }

    }
}