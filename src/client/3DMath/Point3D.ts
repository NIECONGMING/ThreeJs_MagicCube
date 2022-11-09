// import {Position} from "./Position";

export class Point3D
{
       private _x: number;
       private _y: number;
       private _z: number;
       private _w: number;

       public get w(): number
       {
              return this._w;
       }

       public set w(value: number)
       {
              this._w = value;
       }
       public get z(): number
       {
              return this._z;
       }

       public set z(value: number)
       {
              this._z = value;
       }

       public get x(): number
       {
              return this._x;
       }

       public set x(value: number)
       {
              this._x = value;
       }

       public get y(): number
       {
              return this._y;
       }

       public set y(value: number)
       {
              this._y = value;
       }

       constructor (x: number = 0, y: number = 0, z: number = 0, w:number=1)
       {
              this._x = x;
              this._y = y;
              this._z = z;
              this._w = w;
       }
       /**
        * 设定新的值
        * @param px 
        * @param py 
        * @param pz 
        * @param pw 
        */
       public setTo(px: number, py: number, pz: number, pw = 1.0)
       {
              this._x = px;
              this._y = py;
              this._z = pz;
              this._w = pw;
       }
       public copyFrom(v3: Point3D)
       {
              this._x = v3.x;
              this._y = v3.y;
              this._z = v3.z;
       }


       //********全局非静态变量均在此赋值，没有初始值的赋默认值 by Falcon********
       //********即使没有变量也需要此函数，因为不知道该类被哪些类继承 by Falcon********
       protected checkMyProperties(): void
       {
              this._z = this._z == undefined ? NaN : this._z;
              this._z = this._z == undefined ? NaN : this._z;
              this._z = this._z == undefined ? NaN : this._z;
       }



       //============================== 运 算 ==========================================//
       //------------------------------减法-----------------------------//
       public ReturnSubtract(pt: Point3D): Point3D
       {
              let    a = this._x - pt._x,
                     b = this._y - pt._y,
                     c = this._z - pt._z;
              return new Point3D(a, b, c);
       }
       public Subtract(pt: Point3D)
       {
              this._x -= pt._x,
                     this._y -= pt._y,
                     this._z -= pt._z;
       }
       /**
        * 
        * @param pt number[]
        */
       public SubtractN(pt: number[])
       {
              this._x -= pt[0],
                     this._y -= pt[1],
                     this._z -= pt[2];
       }
       /**
        * 点减去数组点
        * @param pt 
        * @returns point3D
        */
       public ReturnSubtractN(pt: number[]): Point3D
       {
              let a = this._x - pt[0],
                     b = this._y - pt[1],
                     c = this._z - pt[2];
              return new Point3D(a, b, c);
       }
       /**
        * 
        * @param scale 
        * @returns 
        */
       public VectorPlus(pt: Point3D)
       {
              this._x += pt._x;
              this._y += pt._y;
              this._z += pt._z;
       }
       /**
        * 
        * @param scale 
        * @returns 
        */
       public VectorPlusNum(pt: number[])
       {
              this._x += pt[0];
              this._y += pt[1];
              this._z += pt[2];
              return [this._x, this._y, this._z];
       }
       /**
        * 
        * @param scale 
        * @returns 
        */
       public ReturnVectorPlus(pt: Point3D): Point3D
       {
              let a = this._x + pt._x,
                     b = this._y + pt._y,
                     c = this._z + pt._z;
              return new Point3D(a, b, c);
       }

       /**
        * 改变当前向量的大小
        * @param scale 
        */
       public ReturnMultiNumber(scale: number): Point3D
       {
              let a = this._x * scale,
                     b = this._y * scale,
                     c = this._z * scale;
              return new Point3D(a, b, c);
       }
       /**
        * 计算两点之间的距离
        * caculateLength
       */
       public caculateLength(point:Point3D) :number
       {
              let a = this._x - point.x ;
              let b = this._y - point.y ;
              let c = this._z - point.z ;
              return Math.abs(a*a+b*b+c*c);
       }


       /**
        * 改变当前向量的大小
        * @param scale 
        */
       public MultiNumber(scale: number)
       {
              this._x = this._x * scale;
              this._y = this._y * scale;
              this._z = this._z * scale;
       }
       public Length(): number
       {
              return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
       }

       /**
        * 向量单位化
        * 返回这个向量的单位向量
        */
       public normalize()
       {
              let a = Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
              this._x = this._x / a;
              this._y = this._y / a;
              this._z = this._z / a;
       }

       /**
        * 向量单位化
        * 返回这个向量的单位向量
        */
       public ReturnNormalize(): Point3D
       {
              let a = Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z)
              // this._x = this._x / a;
              // this._y = this._y / a;
              // this._z = this._z / a;
              return new Point3D(this._x / a, this._y / a, this._z / a);
       }


       /**
        * 向量点乘
        * @param point 
        * @returns 
        */
       public DotPoint(point: Point3D): number
       {
              let a = this._x * point._x;
              let b = this._y * point._y;
              let c = this._z * point._z
              return (a + b + c);
       }

       public isEqualDirection(p: Point3D): boolean
       {
              let a = this.DotPoint(p) / (this.Length() * p.Length());
              let Isequal = false;
              if ((Math.abs(Math.abs(a) - 1) < 0.0001) && a > 0) 
              {
                     Isequal = true;
              }
              return Isequal;
       }

       /**
        * 向量叉乘
        * @param point 
        * @returns  Point3D
        */
       public returnCrossPoint(point: Point3D): Point3D
       {

                 let a1 = this._x,
                     a2 = this._y,
                     a3 = this._z,
                     b1 = point._x,
                     b2 = point._y,
                     b3 = point._z;

              let    x = a2 * b3 - a3 * b2,
                     y = a3 * b1 - a1 * b3,
                     z = a1 * b2 - a2 * b1;
              return new Point3D(x, y, z);
       }


       //********分割线 by Falcon********

       /**转换Vector3D
        */
       // public asVector3D():Vector3D
       // {
       //     return new Vector3D(this.x, this.y, this.z);
       // }
       /**转成数组 */
       public asNumber(): number[]
       {
              return [this._x, this._y, this._z, this._w];
       }
       /**
        * 
        * @returns 
        */
       public asNumberThree(): number[]
       {
              return [this._x, this._y, this._z];
       }
       // public asPosition(): Position
       // {
       //        return new Position(this._x, this._y, this._z);
       // }

}

