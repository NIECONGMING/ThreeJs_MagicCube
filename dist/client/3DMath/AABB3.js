import { Vector3 } from "3DMath/Vector3";
class AABB3 {
    constructor() {
    }
    // Query for dimentions
    size() {
        let vec3 = new Vector3(this.max.x - this.min.x, this.max.y - this.min.y, this.max.z - this.min.z);
        return vec3;
    }
    xSize() { return this.max.x - this.min.x; }
    ySize() { return this.max.y - this.min.y; }
    zSize() { return this.max.z - this.min.z; }
    center() {
        let center = new Vector3((this.max.x + this.min.x) / 2, (this.max.y + this.min.y) / 2, (this.max.z + this.min.z) / 2);
        return center;
    }
    corner(i) {
        // Make sure index is in range...
        // assert(i >= 0);
        // assert(i <= 7);
        // Return it
        return new Vector3((i & 1) ? this.max.x : this.min.x, (i & 2) ? this.max.y : this.min.y, (i & 4) ? this.max.z : this.min.z);
    }
    empty() {
        let kBigNumber = 1e37;
        this.min.x = this.min.y = this.min.z = kBigNumber;
        this.max.x = this.max.y = this.max.z = -kBigNumber;
    }
    //---------------------------------------------------------------------------
    // AABB3::add
    //
    // Add a point to the box
    add(p) {
        // Expand the box as necessary to contain the point.
        if (p.x < this.min.x)
            this.min.x = p.x;
        if (p.x > this.max.x)
            this.max.x = p.x;
        if (p.y < this.min.x)
            this.min.y = p.y;
        if (p.y > this.max.x)
            this.max.y = p.y;
        if (p.z < this.min.x)
            this.min.z = p.z;
        if (p.z > this.max.x)
            this.max.z = p.z;
    }
    //---------------------------------------------------------------------------
    // AABB3::add
    //
    // Add an AABB to the box
    _add(box) {
        // Expand the box as necessary.
        if (box.min.x < this.min.x)
            this.min.x = box.min.x;
        if (box.min.x > this.max.x)
            this.max.x = box.min.x;
        if (box.min.y < this.min.x)
            this.min.y = box.min.y;
        if (box.min.y > this.max.x)
            this.max.y = box.min.y;
        if (box.min.z < this.min.x)
            this.min.z = box.min.z;
        if (box.min.z > this.max.x)
            this.max.z = box.min.z;
    }
    //---------------------------------------------------------------------------
    // AABB3::setToTransformedBox
    //
    // Transform the box and compute the new AABB.  Remember, this always
    // results in an AABB that is at least as big as the origin, and may be
    // considerably bigger.
    //
    // See 12.4.4
    setToTransformedBox(box, m) {
        // // If we're empty, then bail
        // if (box.isEmpty()) {
        //     this.empty();
        //     return;
        // }
        // // Start with the translation portion
        // this.min = this.max = this.getTranslation(m);
        // // Exathis.mine each of the 9 matrix elements
        // // and compute the new AABB
        // if (m.m11 > 0.0) {
        //     this.min.x += m.m11 * box.min.x; this.max.x += m.m11 * box.max.x;
        // } else {
        //     this.min.x += m.m11 * box.max.x; this.max.x += m.m11 * box.min.x;
        // }
        // if (m.m12 > 0.0) {
        //     this.min.y += m.m12 * box.min.x; this.max.y += m.m12 * box.max.x;
        // } else {
        //     this.min.y += m.m12 * box.max.x; this.max.y += m.m12 * box.min.x;
        // }
        // if (m.m13 > 0.0) {
        //     this.min.z += m.m13 * box.min.x; this.max.z += m.m13 * box.max.x;
        // } else {
        //     this.min.z += m.m13 * box.max.x; this.max.z += m.m13 * box.min.x;
        // }
        // if (m.m21 > 0.0) {
        //     this.min.x += m.m21 * box.min.y; this.max.x += m.m21 * box.max.y;
        // } else {
        //     this.min.x += m.m21 * box.max.y; this.max.x += m.m21 * box.min.y;
        // }
        // if (m.m22 > 0.0) {
        //     this.min.y += m.m22 * box.min.y; this.max.y += m.m22 * box.max.y;
        // } else {
        //     this.min.y += m.m22 * box.max.y; this.max.y += m.m22 * box.min.y;
        // }
        // if (m.m23 > 0.0) {
        //     this.min.z += m.m23 * box.min.y; this.max.z += m.m23 * box.max.y;
        // } else {
        //     this.min.z += m.m23 * box.max.y; this.max.z += m.m23 * box.min.y;
        // }
        // if (m.m31 > 0.0) {
        //     this.min.x += m.m31 * box.min.z; this.max.x += m.m31 * box.max.z;
        // } else {
        //     this.min.x += m.m31 * box.max.z; this.max.x += m.m31 * box.min.z;
        // }
        // if (m.m32 > 0.0) {
        //     this.min.y += m.m32 * box.min.z; this.max.y += m.m32 * box.max.z;
        // } else {
        //     this.min.y += m.m32 * box.max.z; this.max.y += m.m32 * box.min.z;
        // }
        // if (m.m33 > 0.0) {
        //     this.min.z += m.m33 * box.min.z; this.max.z += m.m33 * box.max.z;
        // } else {
        //     this.min.z += m.m33 * box.max.z; this.max.z += m.m33 * box.min.z;
        // }
    }
    //---------------------------------------------------------------------------
    // AABB3::isEmpty
    //
    // Return true if the box is enmpty
    isEmpty() {
        // Check if we're inverted on any axis
        return (this.min.x > this.max.x) || (this.min.y > this.max.y) || (this.min.z > this.max.z);
    }
    //---------------------------------------------------------------------------
    // AABB3::contains
    //
    // Return true if the box contains a point
    contains(p) {
        // Check for overlap on each axis
        return;
        (p.x >= this.min.x) && (p.x <= this.max.x) &&
            (p.y >= this.min.y) && (p.y <= this.max.y) &&
            (p.z >= this.min.z) && (p.z <= this.max.z);
    }
    //---------------------------------------------------------------------------
    // AABB3::closestPointTo
    //
    // Return the closest point on this box to another point
    closestPointTo(p) {
        // "Push" p into the box, on each dimension
        let r;
        if (p.x < this.min.x) {
            r.x = this.min.x;
        }
        else if (p.x > this.max.x) {
            r.x = this.max.x;
        }
        else {
            r.x = p.x;
        }
        if (p.y < this.min.y) {
            r.y = this.min.y;
        }
        else if (p.y > this.max.y) {
            r.y = this.max.y;
        }
        else {
            r.y = p.y;
        }
        if (p.z < this.min.z) {
            r.z = this.min.z;
        }
        else if (p.z > this.max.z) {
            r.z = this.max.z;
        }
        else {
            r.z = p.z;
        }
        // Return it
        return r;
    }
    //---------------------------------------------------------------------------
    // AABB3::intersectsSphere
    //
    // Return true if we intersect a sphere.  Uses Arvo's algorithm.
    // public intersectsSphere(center:Vector3, radius:number) :boolean 
    // {
    //     let	closestPoint:Vector3 = this.closestPointTo(center);
    //     return this.distanceSquared(center, closestPoint) < radius*radius;
    // }
    //---------------------------------------------------------------------------
    // AABB3::rayIntersect
    //
    // Parametric intersection with a ray.  Returns parametric point
    // of intsersection in range 0...1 or a really big number (>1) if no
    // intersection.
    //
    // From "Fast Ray-Box Intersection," by Woo in Graphics Gems I,
    // page 395.
    //
    // See 12.9.11
    rayIntersect(rayOrg, rayDelta, returnNormal) {
        // We'll return this huge number if no intersection
        let kNoIntersection = 1e30;
        // Check for point inside box, trivial reject, and deterthis.mine parametric
        // distance to each front face
        let inside = true;
        let xt, xn;
        if (rayOrg.x < this.min.x) {
            xt = this.min.x - rayOrg.x;
            if (xt > rayDelta.x)
                return kNoIntersection;
            xt /= rayDelta.x;
            inside = false;
            xn = -1.0;
        }
        else if (rayOrg.x > this.max.x) {
            xt = this.max.x - rayOrg.x;
            if (xt < rayDelta.x)
                return kNoIntersection;
            xt /= rayDelta.x;
            inside = false;
            xn = 1.0;
        }
        else {
            xt = -1.0;
        }
        let yt, yn;
        if (rayOrg.y < this.min.y) {
            yt = this.min.y - rayOrg.y;
            if (yt > rayDelta.y)
                return kNoIntersection;
            yt /= rayDelta.y;
            inside = false;
            yn = -1.0;
        }
        else if (rayOrg.y > this.max.y) {
            yt = this.max.y - rayOrg.y;
            if (yt < rayDelta.y)
                return kNoIntersection;
            yt /= rayDelta.y;
            inside = false;
            yn = 1.0;
        }
        else {
            yt = -1.0;
        }
        let zt, zn;
        if (rayOrg.z < this.min.z) {
            zt = this.min.z - rayOrg.z;
            if (zt > rayDelta.z)
                return kNoIntersection;
            zt /= rayDelta.z;
            inside = false;
            zn = -1.0;
        }
        else if (rayOrg.z > this.max.z) {
            zt = this.max.z - rayOrg.z;
            if (zt < rayDelta.z)
                return kNoIntersection;
            zt /= rayDelta.z;
            inside = false;
            zn = 1.0;
        }
        else {
            zt = -1.0;
        }
        // Inside box?
        if (inside) {
            if (returnNormal != null) {
                // *returnNormal = -rayDelta;
                returnNormal.x = returnNormal.x - rayDelta.x;
                returnNormal.y = returnNormal.y - rayDelta.y;
                returnNormal.z = returnNormal.z - rayDelta.z;
                // returnNormal->normalize();
            }
            return 0.0;
        }
        let which = 0;
        let t = xt;
        if (yt > t) {
            which = 1;
            t = yt;
        }
        if (zt > t) {
            which = 2;
            t = zt;
        }
        switch (which) {
            case 0: // intersect with yz plane
                {
                    let y = rayOrg.y + rayDelta.y * t;
                    if (y < this.min.y || y > this.max.y)
                        return kNoIntersection;
                    let z = rayOrg.z + rayDelta.z * t;
                    if (z < this.min.z || z > this.max.z)
                        return kNoIntersection;
                    if (returnNormal != null) {
                        returnNormal.x = xn;
                        returnNormal.y = 0.0;
                        returnNormal.z = 0.0;
                    }
                }
                break;
            case 1: // intersect with xz plane
                {
                    let x = rayOrg.x + rayDelta.x * t;
                    if (x < this.min.x || x > this.max.x)
                        return kNoIntersection;
                    let z = rayOrg.z + rayDelta.z * t;
                    if (z < this.min.z || z > this.max.z)
                        return kNoIntersection;
                    if (returnNormal != null) {
                        returnNormal.x = 0.0;
                        returnNormal.y = yn;
                        returnNormal.z = 0.0;
                    }
                }
                break;
            case 2: // intersect with xy plane
                {
                    let x = rayOrg.x + rayDelta.x * t;
                    if (x < this.min.x || x > this.max.x)
                        return kNoIntersection;
                    let y = rayOrg.y + rayDelta.y * t;
                    if (y < this.min.y || y > this.max.y)
                        return kNoIntersection;
                    if (returnNormal != null) {
                        returnNormal.x = 0.0;
                        returnNormal.y = 0.0;
                        returnNormal.z = zn;
                    }
                }
                break;
        }
        // Return parametric point of intersection
        return t;
    }
    //---------------------------------------------------------------------------
    // AABB3::classifyPlane
    //
    // Perform static AABB-plane intersection test.  Returns:
    //
    // <0	Box is completely on the BACK side of the plane
    // >0	Box is completely on the FRONT side of the plane
    // 0	Box intersects the plane
    classifyPlane(n, d) {
        // Inspect the normal and compute the this.minimum and this.maximum
        // D values.
        let minD, maxD;
        if (n.x > 0.0) {
            minD = n.x * this.min.x;
            maxD = n.x * this.max.x;
        }
        else {
            minD = n.x * this.max.x;
            maxD = n.x * this.min.x;
        }
        if (n.y > 0.0) {
            minD += n.y * this.min.y;
            maxD += n.y * this.max.y;
        }
        else {
            minD += n.y * this.max.y;
            maxD += n.y * this.min.y;
        }
        if (n.z > 0.0) {
            minD += n.z * this.min.z;
            maxD += n.z * this.max.z;
        }
        else {
            minD += n.z * this.max.z;
            maxD += n.z * this.min.z;
        }
        // Check if completely on the front side of the plane
        if (minD >= d) {
            return +1;
        }
        // Check if completely on the back side of the plane
        if (maxD <= d) {
            return -1;
        }
        // We straddle the plane
        return 0;
    }
}
