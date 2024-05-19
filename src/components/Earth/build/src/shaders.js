export const commonGLSL = `
#line 2 0
const float pi = 3.1415926535f;

const float nan     = intBitsToFloat(0xffc00000);
const float inf     = intBitsToFloat(0x7f800000);
const float one255  = intBitsToFloat(0x3b808081); // 1.f / 255.f

const int dataImageWidth = 4096;

layout(std140) uniform UniformBlock
{
    // framebuffer:
    vec2    mainFramebufferSize;
    vec2 surfaceFramebufferSize;

    // camera:
    vec4 cameraState;
    float aspectRatio;
    float exposure;

    uint commsInfo;
    uint flags;

    // pick:
    uint pickInfo;
    float pickSizeMultiplier;
    float pickColorMultiplier;

    // earth:
    uint satLineColor;
    uint satViewColor;
    uint satCaptureColor;
    uint sunsetLineColor;
    uint borderLineColor;

    // counts:
    int satelliteCount;
    int satSampleCount;
    int   stationCount;
    int    regionCount;
    int     commsCount;
    int  commsMaxCount;
    int    cameraCount;
};

vec3 mouse() {return cameraState.xyz;}
int cameraObjectID() {return floatBitsToInt(cameraState.w);}

uint  commsGroup            () {return        commsInfo & 0x00ffu;}
float commsPointMinimalSize () {return float((commsInfo & 0xff00u) >> 8u) / 15.f;}

bool flag(uint i) {return (flags & (1u << i)) != 0u;}
bool isPretty               () {return flag(0u);}
bool isMultisampled         () {return flag(1u);}
bool isCamera2D             () {return flag(2u);}
bool isCameraEcliptic       () {return flag(3u);}
bool isCameraSynchronized   () {return flag(4u);}

uniform  lowp  sampler2D  surfaceA;

uniform  lowp  sampler2D    earthA;
uniform  lowp  sampler2D    starsA;
uniform  lowp  sampler2D    bordrA;
uniform  lowp  sampler2D    milkyA;
uniform  lowp  sampler2D     gridA;
uniform  lowp  sampler2D     moonA;

uniform  lowp usampler2D satPointA;
uniform highp usampler2D satCoordA;
uniform  lowp usampler2D    groupA;
uniform highp usampler2D  stationA;
uniform highp usampler2D   cameraA;
uniform  lowp usampler2D  captureA;
uniform  lowp usampler2D    commsA;
uniform  lowp usampler2D   objectA;

uniform  lowp  sampler2D   regionA;
uniform highp  sampler2D  polygonA;
uniform  lowp usampler2D   pickerA;
#line 2 15

lowp uint uintbyte(uint i, uint n)
{
    return (i >> (n << 3)) & 0xffu;
}
lowp uvec4 encodeU32(highp uint u)
{
    return uvec4
    (
        uintbyte(u, 0u),
        uintbyte(u, 1u),
        uintbyte(u, 2u),
        uintbyte(u, 3u)
    );
}

vec4 decodeColor(highp uint u)
{
    return one255 * vec4(encodeU32(u));
}
uint decodeU32(lowp uvec4 u)
{
    return u.r
        | (u.g <<  8u)
        | (u.b << 16u)
        | (u.a << 24u);
}

int   decodeI32(lowp uvec4 u) {return             int(decodeU32(u));}
float decodeF32(lowp uvec4 u) {return uintBitsToFloat(decodeU32(u));}

float decodeF24(lowp uvec3 u) {return     decodeF32(uvec4(0x80u, u));}
int   decodeI24(lowp uvec3 u) {return     decodeI32(uvec4(u, u[2] < 0x80u ? 0u : 0xffu));}

float decodeA16(lowp uvec2 u)
{
    return float(decodeU32(uvec4(u, 0u, 0u)))
         / float(0xffffu);
}
float decodeS16(lowp uvec2 u)
{
    return float( ((int(u.r) << 16) | (int(u.g) << 24)) >> 16 )
         / float(0x7fff);
}

vec3 decodeOct(vec2 o)
{
    vec2 a = abs(o);
    float z = 1.f - a.x - a.y;

    vec2 r = sign(o) * (1.f - a.yx);
    vec3 v = vec3((z >= 0.f ? o : r), z);
    return normalize(v);
}
#line 2 27

struct TimeInterval // difference between two time points in TT time scale
{
    float days; // must be an integer value
    float ms;
};

const float  msInSec = 1000.f;
const float secInDay = 86400.f;
const float  msInDay = msInSec * secInDay;
const float dayInCentury = 36525.f;

const float secInMs  = 1.f / msInSec;
const float dayInMs  = 1.f / msInDay;
const float dayInSec = 1.f / secInDay;
const float centuryInDay = 1.f / dayInCentury;

TimeInterval fromDays(float days)
{
    return TimeInterval
    (
        floor(days),
        fract(days) * msInDay
    );
}
float toDays(TimeInterval t)
{
    return t.days + t.ms * dayInMs;
}

TimeInterval  fromSeconds       (float sec) {return fromDays(sec * dayInSec);}
TimeInterval  fromMilliseconds  (float  ms) {return fromDays( ms * dayInMs );}
float toSeconds         (TimeInterval    t) {return toDays(t) * secInDay;}
float toCenturies       (TimeInterval    t) {return toDays(t) * centuryInDay;}

TimeInterval timeSum(TimeInterval t0, TimeInterval t1)
{
    float days = t0.days + t1.days;
    float ms   = t0.ms   + t1.ms;
    return TimeInterval
    (
        ms <= msInDay ? days : days + 1.f,
        ms <= msInDay ? ms : ms - msInDay
    );
}
TimeInterval timeDiff(TimeInterval t0, TimeInterval t1)
{
    float days = t0.days - t1.days;
    float ms   = t0.ms   - t1.ms;
    return TimeInterval
    (
        ms >= 0.f ? days : days - 1.f,
        ms >= 0.f ? ms : ms + msInDay
    );
}
float timeDiffMs(TimeInterval t0, TimeInterval t1)
{
    return (t0.days - t1.days) * msInDay + (t0.ms - t1.ms);
}
float timeDiffSec(TimeInterval t0, TimeInterval t1)
{
    return timeDiffMs(t0, t1) * secInMs;
}

bool timeLessThan        (TimeInterval t0, TimeInterval t1) {return timeDiffMs(t1, t0) >  0.f;}
bool timeLessThanEqual   (TimeInterval t0, TimeInterval t1) {return timeDiffMs(t1, t0) >= 0.f;}
bool timeGreaterThan     (TimeInterval t0, TimeInterval t1) {return timeDiffMs(t1, t0) <  0.f;}
bool timeGreaterThanEqual(TimeInterval t0, TimeInterval t1) {return timeDiffMs(t1, t0) <= 0.f;}

TimeInterval timeLerp(TimeInterval t0, TimeInterval t1, float k)
{
    if(isnan(k))
        return t0;

    float days = mix(t0.ms, t1.ms, k) * dayInMs + k * (t1.days - t0.days);
    return TimeInterval
    (
        t0.days + floor(days),
        msInDay * fract(days)
    );
}
float timeUnlerp(TimeInterval t0, TimeInterval t1, TimeInterval t)
{
    return timeDiffMs(t, t0) / timeDiffMs(t1, t0);
}

float toPhase(float nu, TimeInterval t) // -> mod2pi(nu * t)
                                        // -> 2pi * fract(nu * t / 2pi)
                                        // -> 2pi * fract(w * t)
                                        // -> 2pi * fract(w * (86400 * days + 0.001 * ms))
{
    float w = fract(nu * secInDay / (2.f * pi));
    return 2.f * pi * fract(w * float(t.days)) + t.ms * nu * secInMs;
}

struct Time
{
    int epoch;
    TimeInterval interval;
};

uniform float TTminusUT; // TT and UT1 millisecond difference for current frame
uniform Time  now; // current  frame
uniform Time prev; // previous frame

#define epochJ2000 0
#define epochUnix  1
/*
#define epochJ1900 2
#define epochB1900 3
#define epochB1950 4
*/
#define epochCount 2
// epoch:
// J2000: 01.01.2000 12:00:00     TT  (Julian Day 2451545.0)
//     or 01.01.2000 11:58:55.816 UTC
// J1900: 00.01.1900 12:00:00     TT  (Julian Day 2415020.0)
// B1900: 00.01.1900 19:31:26.4   TT  (Julian Day 2415020.3135)
// B1950: 00.01.1950 22:09:50.4   TT  (Julian Day 2433282.4235)
//  Unix: 01.01.1970 00:00:00     UTC
const TimeInterval epochDiff[epochCount] = TimeInterval[epochCount] // epoch[0] - epoch[i]
(
    TimeInterval(    0.f,        0.f),
    
    TimeInterval(10957.f, 43157816.f)  // 946727957.816 seconds: 10597 * 86400 * 365.25 + 43200 + 22 - (32.184 + 10 + 22);
                                     // TT  - TAI = 32.184, TAI - UTC = 10 (constant) + 22 (leap, 01.01.2000)
    /*
    TimeInterval(36525.f,    22000.f),
    TimeInterval(36524.f, 59335600.f),
    TimeInterval(18262.f, 49831600.f),
    */
);
TimeInterval timeSinceJ2000(Time time)
{
    return timeDiff(time.interval, epochDiff[time.epoch]);
}
Time fromJ2000To(int epoch, TimeInterval t)
{
    return Time(epoch, timeSum(t, epochDiff[epoch]));
}
#line 2 22
vec2 fromAngles(float longitude, float latitude)
{
    return vec2(longitude, latitude);
}
vec3 toS2(vec2 a)
{
    vec3 s2 = vec3
    (
        cos(a.y) * cos(a.x),
        cos(a.y) * sin(a.x),
        sin(a.y)
    );
    return normalize(s2);
}
vec2 fromS2(vec3 n)
{
    float theta = asin(n.z);
    return vec2
    (
        atan(n.y / cos(theta), n.x / cos(theta)),
        theta
    );
}
vec2 toUV(vec2 a)
{
    return vec2
    (
        a.x / (2.f * pi) + 0.5f,
        0.5f - a.y / pi
    );
}
vec2 fromUV(vec2 a)
{
    return vec2
    (
        (a.x - 0.5f) * 2.f * pi,
        (0.5f - a.y) * pi
    );
}
#line 2 20
struct Ray
{
    vec3 pos;
    vec3 dir;
};
vec3 rayPoint(Ray ray, float t)
{
    return ray.pos + ray.dir * t;
}

struct HeavyRay
{
    vec3 pos;
    vec3 dir;
    vec3 invDir;
};
Ray rayFrom(HeavyRay ray)
{
    return Ray(ray.pos, ray.dir);
}
HeavyRay heavyRayFrom(Ray ray)
{
    return HeavyRay
    (
        ray.pos,
        ray.dir,
        1.f / ray.dir
    );
}

struct RayDistanceRange
{
    float tNear, tFar;
};

RayDistanceRange mergeRange(RayDistanceRange r1, RayDistanceRange r2)
{
    return RayDistanceRange
    (
        r1.tNear > r2.tNear ? r1.tNear : r2.tNear,
        r1.tFar  < r2.tFar  ? r1.tFar  : r2.tFar
    );
}

bool nonempty(RayDistanceRange rdr         ) {return rdr.tNear      <=      rdr.tFar;}
bool contains(RayDistanceRange rdr, float t) {return rdr.tNear <= t && t <= rdr.tFar;}

const RayDistanceRange zeroToInf  = RayDistanceRange(0.f,  inf);
const RayDistanceRange emptyRange = RayDistanceRange(0.f, -1.f);

bool happened(RayDistanceRange rdr) {return nonempty(mergeRange(zeroToInf, rdr));}

struct Sphere
{
    vec3 origin;
    float radius;
};
RayDistanceRange raySphereIntersection(Ray ray, Sphere sphere)
{
    vec3 p = ray.pos - sphere.origin;
    float dp = dot(ray.dir, p);
    float det = dp * dp - dot(p, p) + sphere.radius * sphere.radius;
    if(det < 0.f)
        return emptyRange;
    return RayDistanceRange
    (
        -dp - sqrt(det),
        -dp + sqrt(det)
    );
}

float lightVisibility(vec3 r, Sphere light, Sphere occluder)
    // assuming light.radius > occluder.radius
{
    // avoid float exponent overflow:
    float invR = 1.f / occluder.radius;
    r *= invR;
    light.origin *= invR;
    light.radius *= invR;
    occluder.origin *= invR;
    occluder.radius = 1.f;

    vec3 ro = r               - occluder.origin;
    vec3 rl = r               -    light.origin;
    vec3 ol = occluder.origin -    light.origin;

    float ro2  = dot(ro, ro);
    float rl2  = dot(rl, rl);
    float ol2  = dot(ol, ol);
    float rool = dot(ro, ol);

    if(rool < 0.f)
        return 1.f;

    float rp = light.radius + occluder.radius;
    float rm = light.radius - occluder.radius;

    float d2Umb = ol2 * (occluder.radius * occluder.radius) / (rm * rm);
    float d2Pen = ol2 * (occluder.radius * occluder.radius) / (rp * rp);

    float tg2Umb = (rm * rm) / (ol2 - rm * rm);
    float tg2Pen = (rp * rp) / (ol2 - rp * rp);

    float d2 = rool * rool / ol2;
    float h2 = ro2 - d2;

    float h2Umb = (d2Umb - 2.f * rool * occluder.radius / rm + d2) * tg2Umb;
    float h2Pen = (d2Pen + 2.f * rool * occluder.radius / rp + d2) * tg2Pen;

    /* a correct one is
    float t = (sqrt(h2)    - sqrt(h2Pen))
            / (sqrt(h2Umb) - sqrt(h2Pen));
     * but it has clearly visible precision problems */
    float t = (h2    - h2Pen)
            / (h2Umb - h2Pen);
    float x = clamp(t, 0.f, 1.f);

    float areaRatio = occluder.radius * occluder.radius * rl2
                    / (  light.radius *    light.radius * ro2);
 // return min(areaRatio, 1.f) * x * x     * (2.f - x); // works better if t ~ h
    return 1.f - min(areaRatio, 1.f) * x * x * x * (2.f - x); // works better if t ~ h^2
}

struct Cylinder
{
    vec3 r0, r1;
    float radius;
};
RayDistanceRange rayCylinderIntersection(Ray ray, Cylinder cylinder)
{
    vec3 e = ray.pos - cylinder.r0;
    vec3 l = normalize(cylinder.r1 - cylinder.r0);

    float dl = dot(ray.dir, l);
    float el = dot(e, l);
    float l2 = dot(l, l);

    float a = 1.f - dl * dl;
    float b = dot(ray.dir, e) - dl * el;
    float c = dot(e, e) - cylinder.radius * cylinder.radius - el * el;
    float det = b * b - a * c;
    if(det < 0.f)
        return emptyRange;

    vec4 t = vec4
    (
        (-b - sqrt(det)) / a,
        (-b + sqrt(det)) / a,
        dot(cylinder.r0 - ray.pos, l) / dl,
        dot(cylinder.r1 - ray.pos, l) / dl
    );
    return RayDistanceRange
    (
        max(min(t[0], t[1]), min(t[2], t[3])),
        min(max(t[0], t[1]), max(t[2], t[3]))
    );
}

struct AABB
{
    vec3 pmin, pmax;
};
RayDistanceRange rayAABBIntersection(HeavyRay ray, AABB box, RayDistanceRange rdr)
{
    vec3 a = (box.pmin - ray.pos) * ray.invDir;
    vec3 b = (box.pmax - ray.pos) * ray.invDir;
    vec4 tMin = vec4
    (
        min(a.x, b.x),
        min(a.y, b.y),
        min(a.z, b.z),
        rdr.tNear
    );
    vec4 tMax = vec4
    (
        max(a.x, b.x),
        max(a.y, b.y),
        max(a.z, b.z),
        rdr.tFar
    );
    return RayDistanceRange
    (
        max(tMin[0], max(tMin[1], max(tMin[2], tMin[3]))),
        min(tMax[0], min(tMax[1], min(tMax[2], tMax[3])))
    );
}
RayDistanceRange rayAABBIntersection(Ray ray, AABB box, RayDistanceRange rdr)
{
    return rayAABBIntersection(heavyRayFrom(ray), box, rdr);
}

struct Triangle
{
    vec3 r0, r1, r2;
};
struct RayTriangleIntersection
{
    float t, p, q;
};
bool happened(RayTriangleIntersection i) {return i.p >= 0.f && i.q >= 0.f && i.p + i.q <= 1.f;}
float intersectionDistance(RayTriangleIntersection i) {return i.t;}

// ray: r = o - d * t
// triangle: r - r0 = p * (r1 - r0) + q * (r2 - r0)
// substitute: o - d * t - r0 = p * (r1 - r0) + q * (r2 - r0)
// o - r0 = d * t + p * (r1 - r0) + q * (r2 - r0)
// c = d * t + p * a + q * b
// mat3(d, a, b) * vec3(t, p, q) = c
RayTriangleIntersection rayTriangleIntersection(Ray ray, Triangle triangle, RayDistanceRange rdr)
{
    const RayTriangleIntersection miss = RayTriangleIntersection(-1.f, -1.f, -1.f);

    vec3 a = triangle.r1 - triangle.r0;
    vec3 b = triangle.r2 - triangle.r0;
    vec3 c =     ray.pos - triangle.r0;
    vec3 d = -ray.dir;

    float det0 = dot(d, cross(a, b));

    RayTriangleIntersection hit = RayTriangleIntersection
    (
        dot(c, cross(a, b)) / det0,
        dot(d, cross(c, b)) / det0,
        dot(d, cross(a, c)) / det0
    );

    if(contains(rdr, hit.t))
        return hit;
    else
        return miss;
}
RayTriangleIntersection rayTriangleIntersection(HeavyRay ray, Triangle triangle, RayDistanceRange rdr)
{
    return rayTriangleIntersection(rayFrom(ray), triangle, rdr);
}
#line 2 21
mat3 rotateX(float phi)
{
    return mat3
    (
        vec3(1.f, 0.f, 0.f),
        vec3(0.f, cos(phi), -sin(phi)),
        vec3(0.f, sin(phi),  cos(phi))
    );
}
mat3 rotateY(float phi)
{
    return mat3
    (
        vec3(cos(phi), 0.f, -sin(phi)),
        vec3(0.f, 1.f, 0.f),
        vec3(sin(phi), 0.f,  cos(phi))
    );
}
mat3 rotateZ(float phi)
{
    return mat3
    (
        vec3(cos(phi), -sin(phi), 0.f),
        vec3(sin(phi),  cos(phi), 0.f),
        vec3(0.f, 0.f, 1.f)
    );
}
#line 2 14

const float   sunR = 6.957e8f;
const float  moonR = 1.737e6f;
const float earthR = 6.371e6f;
const float  atmoH = 5.150e4f;

const float   sunMu = 1.3271244e20f;
const float  moonMu = 4.9048695e12f;
const float earthMu = 3.9860044e14f;

float GMST(Time time)
{
    TimeInterval t = timeSinceJ2000(time);

    const float dayInTropicalYear = 2.7379093e-3f;
    return -1.3882241f + 2.f * pi *
    (
        (t.ms - TTminusUT) * (dayInMs * (1.f + dayInTropicalYear))
      + fract(float(t.days) * dayInTropicalYear)
    );
}

struct EclipticCoord
{
    vec2 coord; // longitude and latitude
    float dist;
};
vec3 eclipticPosition(EclipticCoord ec)
{
    return ec.dist * toS2(ec.coord);
}

EclipticCoord sunEclipticCoord(Time time)
{
    TimeInterval t = timeSinceJ2000(time);
    float tc  = toCenturies(t);

    float e   =  0.01670862f - tc * (4.2037e-5f + tc * 1.236e-7f);
    float M   = -0.04318531f + toPhase(1.9909689e-7f, t);
    float phi = -1.38823488f + toPhase(1.9910638e-7f, t)
              +  e * 2.f     * sin(      M)
              +  0.00034897f * sin(2.f * M);
    float r   =  1.00014061f
              -  e           * cos(      M)
              -  0.00013959f * cos(2.f * M);
    return EclipticCoord(vec2(phi, 0.f), 1.4959787e11f * r);
}
mat3 moonRotation(Time time)
{
    TimeInterval t = timeSinceJ2000(time);

    float l = -2.4727853f + toPhase(2.661707e-6f, t);
    float f = -4.6551853f + toPhase(2.672404e-6f, t);
    return rotateZ(f + pi) * rotateX(0.02692f) * rotateZ(l - f);
}
EclipticCoord moonEclipticCoord(Time time)
{
    TimeInterval t = timeSinceJ2000(time);

    float m = - 0.0531853f + toPhase(1.990969e-7f, t);
    float n = - 3.9277853f + toPhase(2.639203e-6f, t);
    float f = - 4.6551853f + toPhase(2.672404e-6f, t);
    float d = - 1.0846853f + toPhase(2.462601e-6f, t);

    float a = - 2.4727853f + toPhase(2.661707e-6f, t)
              + 0.1098f * sin(n)
              + 0.0222f * sin(2.f * d - n)
              + 0.0115f * sin(2.f * d)
              + 0.0037f * sin(2.f * n)
              - 0.0032f * sin(m)
              - 0.0020f * sin(2.f * f)
              + 0.0010f * sin(2.f * d - 2.f * n)
              + 0.0010f * sin(2.f * d - m - n)
              + 0.0009f * sin(2.f * d + n)
              + 0.0008f * sin(2.f * d - m)
              + 0.0007f * sin(n - m)
              - 0.0006f * sin(d)
              - 0.0005f * sin(m + n);
    float b =   0.0895f * sin(f)
              + 0.0049f * sin(n + f)
              + 0.0048f * sin(n - f)
              + 0.0030f * sin(2.f * d - f)
              + 0.0010f * sin(2.f * d + f - n)
              + 0.0008f * sin(2.f * d - f - n)
              + 0.0006f * sin(2.f * d + f);
    float c =   0.016593f
              + 0.000904f * cos(n)
              + 0.000166f * cos(2.f * d - n)
              + 0.000137f * cos(2.f * d)
              + 0.000049f * cos(2.f * n)
              + 0.000015f * cos(2.f * d + n)
              + 0.000009f * cos(2.f * d - m);
    return EclipticCoord(vec2(a, b), earthR / c);
}
#line 2 24
vec3 satPositionNow (int satI) {return uintBitsToFloat(texelFetch(satCoordA, ivec2(satI % 4096,     4 * (satI / 4096)), 0).rgb);}
vec3 satVelocityNow (int satI) {return uintBitsToFloat(texelFetch(satCoordA, ivec2(satI % 4096, 1 + 4 * (satI / 4096)), 0).rgb);}
vec3 satPositionPrev(int satI) {return uintBitsToFloat(texelFetch(satCoordA, ivec2(satI % 4096, 2 + 4 * (satI / 4096)), 0).rgb);}
vec3 satVelocityPrev(int satI) {return uintBitsToFloat(texelFetch(satCoordA, ivec2(satI % 4096, 3 + 4 * (satI / 4096)), 0).rgb);}
#line 2 10

const mat3 fromEcliptic = mat3
(
    vec3(1.f, 0.f, 0.f),
    vec3(0.f,  0.9174819f, 0.3977773f),
    vec3(0.f, -0.3977773f, 0.9174819f)
);

struct Hyperbola
{
    float k;
    float fmin, fmax;
    bool ascend;
};
float eval(Hyperbola hyp, float z)
{
    float det = 0.25 - hyp.k / (hyp.fmax - hyp.fmin);
    float c2 = hyp.ascend
        ? -0.5 - sqrt(det)
        : -0.5 + sqrt(det);
    float c1 = hyp.fmin - hyp.k / c2;
    return c1 + hyp.k / (z + c2);
}
float fov(float z)
{
    const Hyperbola h = Hyperbola(-1.f, 0.05f, 0.7f, false);
    return eval(h, z);
}
float camDist(float z)
{
    const Hyperbola h1 = Hyperbola(-10.f, 1.f, 10.f, true);
    const Hyperbola h2 = Hyperbola(-10.f, 3.f, 40.f, true);
    return isCamera2D()
        ? eval(h1, z)
        : eval(h2, z) * (cameraObjectID() == -2 ? moonR
                      : (cameraObjectID() == -1 ? earthR
                                                : 1e3f));
}

mat3 cameraBasis()
{
    mat3 M = isCameraSynchronized()
        ? rotateZ(-GMST(now))
        : mat3
    (
        1.f, 0.f, 0.f,
        0.f, 1.f, 0.f,
        0.f, 0.f, 1.f
    );
    if(isCameraEcliptic())
        M *= fromEcliptic;

    if(cameraObjectID() >= 0)
    {
        vec3 x = normalize(satPositionNow(cameraObjectID()));
        vec3 z = normalize(cross(x, satVelocityNow(cameraObjectID())));
        M = mat3(x, cross(z, x), z);
    }

    vec3 camZ = M * toS2(fromAngles(pi * mouse().x, 0.5f * pi * mouse().y));
    vec3 camX = normalize(cross(M[2], camZ));
    return mat3(camX, cross(camZ, camX), camZ);
}
vec3 cameraAt()
{
    return cameraObjectID() == -2
        ? fromEcliptic * eclipticPosition(moonEclipticCoord(now))
        : (cameraObjectID() == -1
            ? vec3(0.f)
            : satPositionNow(cameraObjectID()));
}
vec3 cameraPos()
{
    return cameraAt() + cameraBasis()[2] * camDist(mouse().z);
}
Ray cameraRay(vec2 pixel)
{
    if(isCamera2D())
    {
        float k = camDist(mouse().z) / camDist(1.f);
        vec2 uv0 = vec2
        (
            0.5f + 0.5f * (mouse().x + GMST(now) / pi),
            0.5f + 0.5f * (k - 1.f) * mouse().y
        );
        vec2 uv = uv0 + vec2(0.5f, -0.5f) * pixel * k;
        vec3 n = toS2(fromUV(uv));
        return Ray(n * earthR * 1.001f, -n);
    }

    mat3 B = cameraBasis();
    return Ray
    (
        cameraPos(),
        mat3(-B[2], B[0], B[1]) * toS2(fov(mouse().z) * pixel * vec2(aspectRatio, 1.f))
      //mat3(B[0], B[1], B[2]) * normalize(vec3(fov(mouse().z) * pixel * vec2(aspectRatio, 1.f), -1.f))
    );
}
float toDepth(float z) // [near, far] -> [0, 1]
{
    if(isCamera2D())
        return 1.f;

    float near = earthR * 5e-4f;
    float far  = earthR * 5e2f;
    float c1 =        far / (far - near);
    float c2 = near * far / (far - near);
    return c1 - c2 / z;
}
float pointDepth(vec3 pos)
{
    return toDepth(-dot(cameraBasis()[2], pos - cameraPos()));
}
vec3 cameraPixel(vec3 pos)
{
    if(isCamera2D())
    {
        float k = camDist(mouse().z) / camDist(1.f);
        vec2 uv0 = vec2
        (
            0.5f + 0.5f * mouse().x + 0.5f * GMST(now) / pi,
            0.5f + 0.5f * (k - 1.f) * mouse().y
        );
        vec2 uv = toUV(fromS2(normalize(pos)));
        vec2 p = vec2(2.f, -2.f) * (uv - uv0);
        p.x = -1.f + 2.f * fract(0.5f + 0.5f * p.x);
        return vec3(p / k, 1.f);
    }

    mat3 B = cameraBasis();
    vec3 dir = transpose(mat3(-B[2], B[0], B[1])) * normalize(pos - cameraPos());
    vec2 uv = fromS2(dir);
  //vec3 dir = transpose(mat3(B[0], B[1], B[2])) * normalize(pos - cameraPos());
  //vec2 uv = dir.xy / (-dir.z);
    return vec3
    (
        uv / fov(mouse().z) / vec2(aspectRatio, 1.f),
        -1.f + 2.f * pointDepth(pos) // [-1, 1]
    );
}
#line 2 11

lowp uvec4 fetchCapturePixel(int i)
{
    return texelFetch(captureA, ivec2(i % dataImageWidth, i / dataImageWidth), 0);
}
lowp uvec2 fetchCapturePixelHalf(int i)
{
    lowp uvec4 u = fetchCapturePixel(i / 2);
    return i % 2 == 0
        ? u.xy
        : u.zw;
}

struct ByteRange
{
    int begin, end; // offset in bytes
};
int rangeSize(ByteRange range, int entrySize)
{
    return (range.end - range.begin) / entrySize;
}
ByteRange captureRange(int cameraI)
{
    return ByteRange
    (
        decodeI32(fetchCapturePixel(cameraI + 1)),
        decodeI32(fetchCapturePixel(cameraI + 2))
    );
}

struct CaptureInfo
{
    // J2000:
    float days;
    float ms0, ms1;
    ByteRange angleR;
};
CaptureInfo captureInfo(ByteRange captureR, int captureI)
{
    int i = captureR.begin / 4 + captureI * 5;
    return CaptureInfo
    (
        decodeF32(fetchCapturePixel(i    )),
        decodeF32(fetchCapturePixel(i + 1)),
        decodeF32(fetchCapturePixel(i + 2)),
        ByteRange
        (
            decodeI32(fetchCapturePixel(i + 3)),
            decodeI32(fetchCapturePixel(i + 4))
        )
    );
}

int captureLowerBound(ByteRange captureR, TimeInterval t)
{
    ivec2 it = ivec2(0, rangeSize(captureR, 20));
    while(it[0] != it[1])
    {
        int mid = (it[0] + it[1]) >> 1;
        CaptureInfo i = captureInfo(captureR, mid);
        it = timeLessThanEqual(t, TimeInterval(i.days, i.ms1))
            ? ivec2(it[0],     mid)
            : ivec2(mid + 1, it[1]);
    }
    return it[0];
}

float angle(ByteRange angleR, int i)
{
    return decodeA16(fetchCapturePixelHalf(angleR.begin / 2 + i));
}
float interpolate(CaptureInfo capture, TimeInterval t)
{
    int angleCount = rangeSize(capture.angleR, 2);
    TimeInterval t1 = TimeInterval(capture.days, capture.ms1);

    float n = float(angleCount - 1) * (1.f - timeDiffMs(t1, t) / (capture.ms1 - capture.ms0));
    int   i = clamp(int(n), 0, angleCount - 2);
    return mix
    (
        angle(capture.angleR, i    ),
        angle(capture.angleR, i + 1),
        n - float(i)
    );
}
float interpolatedAngle(int cameraI, Time time)
{
    ByteRange captureR = captureRange(cameraI);
    TimeInterval t = timeSinceJ2000(time);
    int captureI = captureLowerBound(captureR, t);
    if(captureI == rangeSize(captureR, 20))
        return nan;
    CaptureInfo capture = captureInfo(captureR, captureI);
    return timeLessThanEqual(TimeInterval(capture.days, capture.ms0), t)
        ? interpolate(capture, t)
        : nan;
}

#ifndef FRAGSHADER
struct CameraInfo
{
    int satelliteID;
    float captureAngle;
    vec2 viewAngle;
    vec2 captureOrientation; // interpolatedAngle(now), (prev)
};
CameraInfo cameraInfo(int cameraI)
{
    int i = cameraCount + 2 + 4 * cameraI;
    uvec3 u = texelFetch(cameraA, ivec2(cameraI, 0), 0).rgb;
    return CameraInfo
    (
        int(u.z),
        decodeF32(fetchCapturePixel(i + 1)),
        vec2
        (
            decodeF32(fetchCapturePixel(i + 2)),
            decodeF32(fetchCapturePixel(i + 3))
        ),
        uintBitsToFloat(u.xy)
    );
}
#endif
#line 2 12

const vec3 wl = vec3(615.f, 535.f, 445.f) * 1e-9f; // spectral representation wavelengths
const mat3 spectralToSRGB = mat3 // spectral -> sRGB (including E -> D65)
(
     1.6218f, -0.0374f, -0.0283f,
    -0.4493f,  1.0598f, -0.1119f,
     0.0325f, -0.0742f,  1.0491f
);
const mat3 sRGBtoSpectral = inverse(spectralToSRGB);

const vec3 sunSpectral = vec3(0.3147f, 0.3431f, 0.3422f);
const vec3 sunSRGB = spectralToSRGB * sunSpectral;

vec3 expose(vec3 x)
{
    const mat3 m1 = mat3
    (
        0.59719f, 0.07600f, 0.02840f,
        0.35458f, 0.90834f, 0.13383f,
        0.04823f, 0.01566f, 0.83777f
    );
    const mat3 m2 = mat3
    (
         1.60475f, -0.10208f, -0.00327f,
        -0.53108f,  1.10813f, -0.07276f,
        -0.07367f, -0.00605f,  1.07602f
    );
    vec3 v = m1 * x * exposure;
    vec3 a = v * (v + 0.0245786f) - 0.000090537f;
    vec3 b = v * (0.983729f * v + 0.432951f) + 0.238081f;
    return clamp(m2 * (a / b), 0.f, 1.f);
}

vec3 decodeSRGB(vec3 color)
{
    return mix
    (
        color / 12.92f,
        pow((color + 0.055f) / 1.055f, vec3(2.4f)),
        step(vec3(0.04045f), color)
    );
}
vec3 encodeSRGB(vec3 color)
{
    return mix
    (
        12.92f * color,
        1.055f * pow(color, vec3(1.f / 2.4f)) - 0.055f,
        step(vec3(0.0031308f), color)
    );
}
#line 2 13

lowp uvec3 fetchObjectPixel(int i)
{
    return texelFetch(objectA, ivec2(i % dataImageWidth, i / dataImageWidth), 0).rgb;
}
vec3 fetchA16x3(int i)
{
    uvec3 u0 = fetchObjectPixel(i);
    uvec3 u1 = fetchObjectPixel(i + 1);
    return vec3
    (
        decodeA16(u0.xy),
        decodeA16(uvec2(u0.z, u1.x)),
        decodeA16(u1.yz)
    );
}
vec3 fetchS16x3(int i)
{
    uvec3 u0 = fetchObjectPixel(i);
    uvec3 u1 = fetchObjectPixel(i + 1);
    return vec3
    (
        decodeS16(u0.xy),
        decodeS16(uvec2(u0.z, u1.x)),
        decodeS16(u1.yz)
    );
}
int fetchObjectOffset(int objectI)
{
    return decodeI24(fetchObjectPixel(objectI));
}
AABB fetchObjectMainAABB(int objectI)
{
    int off = fetchObjectOffset(objectI);
    return AABB
    (
        vec3
        (
            decodeF24(fetchObjectPixel(off + 1)),
            decodeF24(fetchObjectPixel(off + 2)),
            decodeF24(fetchObjectPixel(off + 3))
        ),
        vec3
        (
            decodeF24(fetchObjectPixel(off + 4)),
            decodeF24(fetchObjectPixel(off + 5)),
            decodeF24(fetchObjectPixel(off + 6))
        )
    );
}
int fetchTriangleCount(int objectI)
{
    return decodeI24(fetchObjectPixel(fetchObjectOffset(objectI)));
}
AABB fetchObjectAABB(int objectI, uint i)
{
    int off = fetchObjectOffset(objectI) + 7;
    int i0 = off + 4 * int(i);
    return AABB
    (
        fetchA16x3(i0    ),
        fetchA16x3(i0 + 2)
    );
}
Triangle fetchObjectTriangle(int objectI, uint i)
{
    int triangleCount = fetchTriangleCount(objectI);
    int off = fetchObjectOffset(objectI) + 3 + 8 * triangleCount;
    int i0 = off + 6 * int(i);
    return Triangle
    (
        fetchA16x3(i0    ),
        fetchA16x3(i0 + 2),
        fetchA16x3(i0 + 4)
    );
}
vec3 fetchObjectNorm(int objectI, uint i, RayTriangleIntersection rti)
{
    int triangleCount = fetchTriangleCount(objectI);
    int off = fetchObjectOffset(objectI) + 3 + 14 * triangleCount;
    int i0 = off + 4 * int(i);
    vec3 v0 = fetchS16x3(i0);
    vec3 v1 = fetchS16x3(i0 + 2);
    vec3 n0 = decodeOct(v0.xy);
    vec3 n1 = decodeOct(vec2(v0.z, v1.x));
    vec3 n2 = decodeOct(v1.yz);

    return (1.f - rti.p - rti.q) * n0
                + rti.p          * n1
                        + rti.q  * n2;
}

struct Material
{
    vec3 albedo;
    float roughness;
    float metalness;
};
Material fetchTriangleMaterial(int objectI, uint i)
{
    int triangleCount = fetchTriangleCount(objectI);
    int off = fetchObjectOffset(objectI) + 3 + 18 * triangleCount;
    uvec3 m = fetchObjectPixel(off + int(i));
    return Material
    (
        vec3
        (
            float(m.x >> 3u) / 31.f,
            float(((m.x & 0x7u) << 3u) | (m.y >> 5u)) / 63.f,
            float(m.y & 0x1fu) / 31.f
        ),
        float(m.z & 0x3fu) /  63.f,
        float(m.z & 0xc0u) / 192.f
    );
}

uint ctz(uint n)
{
    uint m = -n & n;
    return 32u - ((m & 0x0000FFFFu) != 0u ? 16u : 0u)
               - ((m & 0x00FF00FFu) != 0u ?  8u : 0u)
               - ((m & 0x0F0F0F0Fu) != 0u ?  4u : 0u)
               - ((m & 0x33333333u) != 0u ?  2u : 0u)
               - ((m & 0x55555555u) != 0u ?  1u : 0u)
               - ( m                != 0u ?  1u : 0u);
}

struct RayObjectIntersection
{
    uint triangleID;
    RayTriangleIntersection rti;
};
bool happened(RayObjectIntersection i) {return i.triangleID != uint(-1);}
float intersectionDistance(RayObjectIntersection i) {return intersectionDistance(i.rti);}

RayObjectIntersection rayObjectIntersection(int objectI, HeavyRay ray, RayDistanceRange rdr)
{
    RayObjectIntersection result = RayObjectIntersection(uint(-1), RayTriangleIntersection(0.f, 0.f, 0.f));

    // stackless traversal based on Rasmus Barringer's paper:
    // https://jcgt.org/published/0002/01/03/paper.pdf
    // https://github.com/Woking-34/dynamic-stackless-binary-tree-traversal

    uint node     = 1u; // current node; indexing from 1, easier to go up: node >>= up
    uint traverse = 0u; // helps to evaluate up count

    uint triangleCount = uint(fetchTriangleCount(objectI));
    while(true)
    {
        if(node < triangleCount)
        {
            RayDistanceRange iLeft  = rayAABBIntersection(ray, fetchObjectAABB(objectI, 2u * node - 1u), rdr);
            RayDistanceRange iRight = rayAABBIntersection(ray, fetchObjectAABB(objectI, 2u * node     ), rdr);
            bool bLeft  = nonempty(iLeft );
            bool bRight = nonempty(iRight);

            if(bLeft || bRight)
            {
                traverse = 2u * traverse + (bLeft ^^ bRight ? 1u : 0u);
                node = !bRight || (bLeft && iLeft.tNear <= iRight.tNear)
                    ? 2u * node
                    : 2u * node + 1u;
                continue;
            }
        }
        else
        {
            uint i = node - triangleCount;
            RayTriangleIntersection intersection = rayTriangleIntersection(ray, fetchObjectTriangle(objectI, i), rdr);
            if(happened(intersection))
            {
                rdr.tFar = intersectionDistance(intersection);
                result = RayObjectIntersection(i, intersection);
            }
        }

        uint up = ctz(++traverse);
        traverse >>= up;
        node     >>= up;

        if(node <= 1u)
            return result;

        node = node + 1u - ((node & 1u) << 1u); // node = sibling(node);
    }
}
RayObjectIntersection rayObjectIntersection(int objectI, Ray ray, RayDistanceRange rdr)
{
    return rayObjectIntersection(objectI, heavyRayFrom(ray), rdr);
}
#line 2 18

struct vec7
{
    vec3 r;
    vec3 v;
    TimeInterval t; // J2000
};

struct Orbit
{
    vec3 x, y;
    float e;
    float n;
    float E0;
    TimeInterval t0; // J2000
};

Orbit orbitFromVec7(vec7 point) // ECI
{
    vec3 c = cross(point.r, point.v);

    vec3 r = normalize(point.r);
    vec3 e = cross(point.v, c) / earthMu - r;
    float e2 = dot(e, e);

    vec3 ex = e2 > 1e-7f ? normalize(e) : r;
    vec3 ey = cross(normalize(c), ex);

    float p = dot(c, c) / earthMu;
    float a = p /     (1.f - e2);
    float b = a * sqrt(1.f - e2);

    float sinE0 = dot(point.r, ey) / b;
    float cosE0 = dot(point.r, ex) / a + sqrt(e2);

    return Orbit
    (
        ex * a,
        ey * b,
        sqrt(e2),
        sqrt(earthMu / (a * a * a)),
        atan(sinE0, cosE0),
        point.t
    );
}

float solveKeplerian(float M, float e)
{
    float E = sin(M) < 0.f
        ? M - e
        : M + e;

    for(uint i = 0u; i < 5u; ++i)
        E -= (E - e * sin(E) - M) / (1.f - e * cos(E));
    return E;
}
float orbitPeriod(Orbit orbit)
{
    return 2.f * pi / orbit.n;
}
float orbitEccentricAnomaly(Orbit orbit, Time time)
{
    float ndt = toPhase(orbit.n, timeDiff(timeSinceJ2000(time), orbit.t0));
    float M = ndt + orbit.E0 - orbit.e * sin(orbit.E0);
    return solveKeplerian(M, orbit.e);
}
float orbitTime(Orbit orbit, float E)
{
    return (E - orbit.e * sin(E)) / orbit.n;
}

vec3 orbitPoint(Orbit orbit, float E)
{
    return orbit.x * (cos(E) - orbit.e)
         + orbit.y * (sin(E)          );
}
vec3 orbitPoint(Orbit orbit, Time time)
{
    return orbitPoint(orbit, orbitEccentricAnomaly(orbit, time));
}

vec3 orbitVelocityDirection(Orbit orbit, float E)
{
    return normalize(-orbit.x * sin(E) + orbit.y * cos(E));
}
vec3 orbitVelocityDirection(Orbit orbit, Time time)
{
    return orbitVelocityDirection(orbit, orbitEccentricAnomaly(orbit, time));
}

float orbitVelocityMagnitude(Orbit orbit, float E)
{
    float f2 = dot(orbit.x, orbit.x)
             * (1.f + orbit.e * cos(E))
             / (1.f - orbit.e * cos(E));
    return orbit.n * sqrt(f2);
}
float orbitVelocityMagnitude(Orbit orbit, Time time)
{
    return orbitVelocityMagnitude(orbit, orbitEccentricAnomaly(orbit, time));
}

vec3 orbitVelocity(Orbit orbit, float E)
{
    return orbitVelocityMagnitude(orbit, E) * orbitVelocityDirection(orbit, E);
}
vec3 orbitVelocity(Orbit orbit, Time time)
{
    return orbitVelocity(orbit, orbitEccentricAnomaly(orbit, time));
}

float fetchSatPixel(int pixelI)
{
    return decodeF32(texelFetch(satPointA, ivec2(pixelI % dataImageWidth, pixelI / dataImageWidth), 0));
}
int satBegin(int satI)
{
    return 2 + satI * (5 + satSampleCount * 6);
}
uint satID(int satI)
{
    return floatBitsToUint(fetchSatPixel(satBegin(satI)));
}
TimeInterval fetchSatTimeBegin(int satI)
{
    return TimeInterval
    (
        fetchSatPixel(satBegin(satI) + 1),
        fetchSatPixel(satBegin(satI) + 2)
    );
}
TimeInterval fetchSatTimeEnd(int satI)
{
    return TimeInterval
    (
        fetchSatPixel(satBegin(satI) + 3),
        fetchSatPixel(satBegin(satI) + 4)
    );
}
vec3 fetchSatPosition(int satI, int timeI)
{
    int begin = satBegin(satI) + 5;
    return vec3
    (
        fetchSatPixel(begin + 6 * timeI    ),
        fetchSatPixel(begin + 6 * timeI + 1),
        fetchSatPixel(begin + 6 * timeI + 2)
    );
}
vec3 fetchSatVelocity(int satI, int timeI)
{
    int begin = satBegin(satI) + 5;
    return vec3
    (
        fetchSatPixel(begin + 6 * timeI + 3),
        fetchSatPixel(begin + 6 * timeI + 4),
        fetchSatPixel(begin + 6 * timeI + 5)
    );
}
Orbit fetchSatOrbit(int timeI, int satI, Time time)
{
    return orbitFromVec7(vec7
    (
        fetchSatPosition(satI, timeI),
        fetchSatVelocity(satI, timeI),
        timeSinceJ2000(time)
    ));
}

struct OrbitPair
{
    float k; // interpolation coefficient, [0:1]
    Orbit orbit[2];
};
OrbitPair orbitPair(int satI, Time time)
{
    TimeInterval t0 = fetchSatTimeBegin(satI);
    TimeInterval t1 = fetchSatTimeEnd  (satI);

    float N = float(satSampleCount - 1);
    float k = timeUnlerp(t0, t1, timeSinceJ2000(time));
    float n = k * N;

    int i0 = clamp(int(floor(n))    , 0, satSampleCount - 1);
    int i1 = clamp(int(floor(n)) + 1, 0, satSampleCount - 1);

    Orbit orbit0 = fetchSatOrbit(i0, satI, Time(epochJ2000, timeLerp(t0, t1, float(i0) / N)));
    Orbit orbit1 = fetchSatOrbit(i1, satI, Time(epochJ2000, timeLerp(t0, t1, float(i1) / N)));

    if(i0 == i1)
        return OrbitPair(0.f     , Orbit[2](orbit0, orbit0));
    else
        return OrbitPair(fract(n), Orbit[2](orbit0, orbit1));
}
vec3 interpolatedOrbitPoint(int satI, Time time)
{
    OrbitPair op = orbitPair(satI, time);
    return mix
    (
        orbitPoint(op.orbit[0], time),
        orbitPoint(op.orbit[1], time),
        op.k
    );
}
vec3 interpolatedOrbitVelocity(int satI, Time time)
{
    OrbitPair op = orbitPair(satI, time);
    return mix
    (
        orbitVelocity(op.orbit[0], time),
        orbitVelocity(op.orbit[1], time),
        op.k
    );
}
#line 2 19
float DistributionGGX(float NH, float r)
{
    float nom    = r * r * r * r;
    float denom0 = (NH * NH * (nom - 1.f) + 1.f);
    float denom  = pi * denom0 * denom0;
    return nom / denom;
}
float GeometrySchlickGGX(float NV, float roughness)
{
    float r = (roughness + 1.f);
    float k = (r * r) / 8.f;

    float nom   = NV;
    float denom = NV * (1.f - k) + k;
    return nom / denom;
}
float GeometrySmith(float NV, float NL, float roughness)
{
    float ggx1 = GeometrySchlickGGX(NL, roughness);
    float ggx2 = GeometrySchlickGGX(NV, roughness);
    return ggx1 * ggx2;
}
vec3 FresnelSchlick(float HV, vec3 F0)
{
    return F0 + (1.f - F0) * pow(1.f - HV, 5.f);
}
#line 2 23

#ifdef FRAGSHADER
vec4 sample4(float p)
{
    float dx = dFdx(p) * 0.25f;
    float dy = dFdy(p) * 0.25f;
    return vec4
    (
        p - dx - dy,
        p - dx + dy,
        p + dx - dy,
        p + dx + dy
    );
}
vec2[4] sample4(vec2 p)
{
    vec2 dx = dFdx(p) * 0.25f;
    vec2 dy = dFdy(p) * 0.25f;
    return vec2[4]
    (
        p - dx - dy,
        p - dx + dy,
        p + dx - dy,
        p + dx + dy
    );
}
vec3[4] sample4(vec3 p)
{
    vec3 dx = dFdx(p) * 0.25f;
    vec3 dy = dFdy(p) * 0.25f;
    return vec3[4]
    (
        p - dx - dy,
        p - dx + dy,
        p + dx - dy,
        p + dx + dy
    );
}
#endif
#line 2 25
// http://www.thetenthplanet.de/archives/4519
float chapman(float x, float cosZ)
{
    float c = sqrt(0.5f * pi * x);
    float sinZ = sqrt(1.f - cosZ * cosZ);
    return cosZ >= 0.f
        ? c / ((c - 1.f) * cosZ + 1.f)
        : c / ((c - 1.f) * cosZ - 1.f)
        + 2.f * c * exp(x * (1.f - sinZ)) * sqrt(sinZ);
}
const float rayleighH = 8e3f;
vec3 rayleighScattering(float x)
{
    const vec3 n = vec3(1.000295f, 1.000300f, 1.000307f);
    const float N = 2.504e25f;
    const vec3 K = 8.f / 3.f * pi * pi * pi * (n * n - 1.f) * (n * n - 1.f) / N;
    const vec3 wl4 = 1.f / ((wl * wl) * (wl * wl));
    return K * wl4 * exp(earthR / rayleighH - x);
}
float rayleighPhase(float cosZ)
{
    return 3.f / 16.f / pi * (1.f + cosZ * cosZ);
}
vec3 rayleighOpticalDepth(float h, float cosZ)
{
    float x = h / rayleighH;
    return rayleighScattering(x) * rayleighH * chapman(x, cosZ);
}

const uint layerCount = 5u;
float layerR(uint i)
{
    return earthR - 4.f * rayleighH * log(1.f - float(i) / float(layerCount));
}
vec3 integrand(vec3 r, vec3 rayDir, vec3 lightDir)
{
    vec3 l = normalize(r);
    float x = length(r) / rayleighH;

    vec3 a = rayleighScattering(x);
    float lCam = chapman(x, dot(l,   rayDir));
    float lSun = chapman(x, dot(l, lightDir));
    return a * exp(-a * rayleighH * (lCam + lSun));
}
vec3 atmoFromEarth(Ray ray, vec3 lightDir)
{
    float dl = dot(normalize(ray.pos), lightDir);
    if(dl < -0.1f)
        return vec3(0.f);

    float t0 = dl < 0.f
        ? rayCylinderIntersection(ray, Cylinder(vec3(0.f), -earthR * lightDir, earthR)).tFar
        : 0.f;
    vec3 f0 = integrand(rayPoint(ray, t0), ray.dir, lightDir);
    vec3 color = vec3(0.f);
    for(uint i = 0u; i + 1u < layerCount; ++i)
    {
        float t1 = raySphereIntersection(ray, Sphere(vec3(0.f), layerR(i + 1u))).tFar;
        if(dl < 0.f && t1 <= t0)
            continue;
        vec3 f1 = integrand(rayPoint(ray, t1), ray.dir, lightDir);
        color += abs(t1 - t0) * (f1 - f0) / log(f1 / f0);

        t0 = t1;
        f0 = f1;
    }
    return rayleighPhase(dot(ray.dir, lightDir)) * color;
}
vec3 atmo(Ray ray, float tFar, vec3 lightDir)
{
    Cylinder shadow = Cylinder(vec3(0.f), -2.f * earthR * lightDir, earthR);
    RayDistanceRange I = rayCylinderIntersection(ray, shadow);

    if(I.tNear < 0.f && tFar < I.tFar)
        return vec3(0.f);

    bool beginsInShadow = I.tNear <  0.f &&  0.f < I.tFar;
    bool   endsInShadow = I.tNear < tFar && tFar < I.tFar;
    float t0 = beginsInShadow
        ? I.tFar
        : 0.f;
    float t1 = endsInShadow
        ? I.tNear
        : tFar;
    vec3 f0 = integrand(rayPoint(ray, t0), ray.dir, lightDir);
    vec3 f1 = integrand(rayPoint(ray, t1), ray.dir, lightDir);
    return rayleighPhase(dot(ray.dir, lightDir)) * abs(t1 - t0) * (f1 - f0) / log(f1 / f0);
}

vec3 skyI(float x)
{
    const vec3 a = vec3( 0.0260596f,  0.092723f,  0.172234f);
    const vec3 b = vec3(-0.0819419f, -0.232979f, -0.432763f);
    const vec3 c = vec3( 0.0506876f,  0.152135f,  0.310905f);
    const vec3 d = vec3( 0.051657f,   0.059264f,  0.060268f);
    const vec3 e = vec3(18.1825f, 17.9718f, 15.2404f);
    return (1.f + tanh(e * x)) *
           (a * x * x * x
          + b * x * x
          + c * x
          + d);
}
#line 2 26
vec3 stationPosition(int stationI, Time time)
{
    vec2 a = uintBitsToFloat(texelFetch(stationA, ivec2(stationI, 0), 0).rg);
    return 1.005f * earthR * toS2(a + vec2(GMST(time), 0.f));
}
uint stationID(int stationI)
{
    return texelFetch(stationA, ivec2(stationI, 0), 0).b;
}
#line 2 16

uint fetchGroupU32(int i)
{
    return texelFetch(groupA, ivec2(i & 0xff, i >> 8), 0).r;
}
uint fetchGroupU8(int i)
{
    return uintbyte(fetchGroupU32(i >> 2), uint(i & 0x3));
}

uint     satGroup(int     satI)
{
    return fetchGroupU8(satI);
}
uint stationGroup(int stationI)
{
    return fetchGroupU8(256 * 4 * 256 + stationI);
}
uint  regionGroup(int  regionI)
{
    return fetchGroupU32(256 * 257 + regionI);
}
uint   commsGroup(int   commsI)
{
    return commsGroup();
}

uint regionID(int regionI)
{
    return fetchGroupU32(256 * 258 + regionI);
}
vec3 regionPosition(int regionI, Time time)
{
    vec2 a = uintBitsToFloat
    (
        uvec2
        (
            fetchGroupU32(256 * 259 + 2 * regionI    ),
            fetchGroupU32(256 * 259 + 2 * regionI + 1)
        )
    );
    return earthR * toS2(a + vec2(GMST(time), 0.f));
}

lowp vec3 packI24(int fourBits, int idx)
{
    return vec3(float((fourBits << 4) | (idx >> 16)), float((idx >> 8) & 0xff), float(idx & 0xff)) * one255;
}
lowp vec4 packSatIndex(int idx)
{
    return vec4(packI24(1, idx), 1.f);
}
lowp vec4 packStationIndex(int idx)
{
    return vec4(packI24(2, idx), 1.f);
}
lowp vec4 packRegionIndex(int idx)
{
    return vec4(packI24(3, idx), 1.f);
}
lowp vec4 packCommsIndex(int idx)
{
    return vec4(packI24(4, idx), 1.f);
}

vec4 groupColor(uint groupI)
{
    return decodeColor(fetchGroupU32(256 * 261 + int(groupI)));
}
uint groupInfo(uint groupI)
{
    return fetchGroupU32(256 * 262 + int(groupI));
}
bool groupInfoBit(uint groupI, uint bit)
{
    return (groupInfo(groupI) & (1u << bit)) != 0u;
}
uint groupPointShape(uint groupI)
{
    return (groupInfo(groupI) >> 5u) & 0x7u;
}
float groupPointNormalizedSize(uint groupI) // -> [0, 1]
{
    return float((groupInfo(groupI) >> 8u) & 0xfu) / float(0xfu);
}
float pointScreenSize(float normalizedSize)
{
    return mainFramebufferSize.y * (1.5e-2f * (0.1f + float(normalizedSize)));
}
float groupPointSize(uint groupI)
{
    return pointScreenSize(groupPointNormalizedSize(groupI));
}

bool     satPick(int     satI)
{
    return (pickInfo & 0xf0000000u) == 0x10000000u && ((pickInfo & 0x0fffff00u) >> 8u) == uint(satI);
}
bool stationPick(int stationI)
{
    return (pickInfo & 0xf0000000u) == 0x20000000u && ((pickInfo & 0x0fffff00u) >> 8u) == uint(stationI);
}
bool  regionPick(int  regionI)
{
    return (pickInfo & 0xf0000000u) == 0x30000000u && ((pickInfo & 0x0fffff00u) >> 8u) == uint(regionI);
}
bool   commsPick(int   commsI)
{
    return (pickInfo & 0xf0000000u) == 0x40000000u && ((pickInfo & 0x0fffff00u) >> 8u) == uint(commsI);
}

vec4  satPointColor     (int     satI) {return groupColor(satGroup(satI));}
float satPointSize      (int     satI) {return (satPick(satI) ? float(pickSizeMultiplier) : 1.f) * groupPointSize(satGroup(satI));}
uint  satPointShape     (int     satI) {return groupPointShape(satGroup(satI));}
bool  satPointVisibility(int     satI) {return groupInfoBit(satGroup(satI), 0u);}
bool  satOrbitVisibility(int     satI) {return groupInfoBit(satGroup(satI), 1u);}
bool  satRenderLine     (int     satI) {return groupInfoBit(satGroup(satI), 2u);}
bool  satRenderView     (int     satI) {return groupInfoBit(satGroup(satI), 3u);}
bool  satRenderCapture  (int     satI) {return groupInfoBit(satGroup(satI), 4u);}

vec4  stationPointColor (int stationI) {return groupColor(stationGroup(stationI));}
float stationPointSize  (int stationI) {return (stationPick(stationI) ? float(pickSizeMultiplier) : 1.f) * groupPointSize(stationGroup(stationI));}
uint  stationPointShape (int stationI) {return groupPointShape(stationGroup(stationI));}
bool  stationVisibility (int stationI) {return groupInfoBit(stationGroup(stationI), 0u);}

vec4  regionColor       (int  regionI) {return (regionPick(regionI) ? float(pickColorMultiplier) : 1.f) * groupColor(regionGroup(regionI));}
bool  regionVisibility  (int  regionI) {return groupInfoBit(regionGroup(regionI), 0u);}

vec4  commsColor     (int commsI) {return groupColor(commsGroup(commsI));}
float commsPointSize (int commsI) {return groupPointSize(commsGroup(commsI));}
uint  commsPointShape(int commsI) {return groupPointShape(commsGroup(commsI));}
bool  commsVisibility(int commsI) {return groupInfoBit(commsGroup(commsI), 0u);}

const vec4 clipAway = vec4(0.f);
#define CLIP_IF(x) if(x) {gl_Position = clipAway; return;}
#line 2 17

struct Index
{
    int data;
};
int indexV(Index i) {return i.data & 0xfffff;}
int indexK(Index i) {return i.data >> 20;} // 0: nothing
                                           // 1: satellite
                                           // 2: station
                                           // 3: region

Index lookupIndex(uint ID)
{
    ivec2 it = ivec2(0, satelliteCount);
    while(it[0] != it[1])
    {
        int mid = (it[0] + it[1]) >> 1;
        it = ID <= satID(mid)
            ? ivec2(it[0],     mid)
            : ivec2(mid + 1, it[1]);
    }
    if(it[0] != satelliteCount && satID(it[0]) == ID)
        return Index(0x100000 + it[0]);

    it = ivec2(0, stationCount);
    while(it[0] != it[1])
    {
        int mid = (it[0] + it[1]) >> 1;
        it = ID <= stationID(mid)
            ? ivec2(it[0],     mid)
            : ivec2(mid + 1, it[1]);
    }
    if(it[0] != stationCount && stationID(it[0]) == ID)
        return Index(0x200000 + it[0]);

    it = ivec2(0, regionCount);
    while(it[0] != it[1])
    {
        int mid = (it[0] + it[1]) >> 1;
        it = ID <= regionID(mid)
            ? ivec2(it[0],     mid)
            : ivec2(mid + 1, it[1]);
    }
    if(it[0] != regionCount && regionID(it[0]) == ID)
        return Index(0x300000 + it[0]);

    return Index(0);
}

bool indexVisibility(Index i)
{
    switch(indexK(i))
    {
        case 1: return satPointVisibility(indexV(i));
        case 2: return  stationVisibility(indexV(i));
        case 3: return   regionVisibility(indexV(i));
        default: return false;
    }
}
vec3 indexPosition(Index i, Time t)
{
    switch(indexK(i))
    {
        case 1: return interpolatedOrbitPoint(indexV(i), t);
        case 2: return        stationPosition(indexV(i), t);
        case 3: return         regionPosition(indexV(i), t);
        default: return vec3(0.f);
    }
}
vec3 indexPositionNow(Index i)
{
    switch(indexK(i))
    {
        case 1: return  satPositionNow(indexV(i)     );
        case 2: return stationPosition(indexV(i), now);
        case 3: return  regionPosition(indexV(i), now);
        default: return vec3(0.f);
    }
}
#line 2 13

lowp uvec4 fetchCommsPixel(int i)
{
    return texelFetch(commsA, ivec2(i % dataImageWidth, i / dataImageWidth), 0);
}

struct CommsPack
{
    Index sender, receiver;
    // J2000:
    float days;
    float ms0, ms1;
    float data;
};

TimeInterval commsTime0(int packI)
{
    return TimeInterval
    (
        decodeF32(fetchCommsPixel(6 * packI + 6)),
        decodeF32(fetchCommsPixel(6 * packI + 7))
    );
}
int lookupCommsI(int k, Time time)
{
    ivec2 it = ivec2(0, commsCount);
    while(it[0] != it[1])
    {
        int mid = (it[0] + it[1]) >> 1;
        it = timeLessThanEqual(timeSinceJ2000(time), commsTime0(mid))
            ? ivec2(it[0],     mid)
            : ivec2(mid + 1, it[1]);
    }
    return it[0] + k - commsMaxCount;
}
CommsPack fetchCommsPack(int packI)
{
    return CommsPack
    (
        lookupIndex(decodeU32(fetchCommsPixel(6 * packI + 4))),
        lookupIndex(decodeU32(fetchCommsPixel(6 * packI + 5))),
        decodeF32(fetchCommsPixel(6 * packI + 6)),
        decodeF32(fetchCommsPixel(6 * packI + 7)),
        decodeF32(fetchCommsPixel(6 * packI + 8)),
        decodeF32(fetchCommsPixel(6 * packI + 9))
    );
}

float commsSizeMultiplier(float data)
{
    const float ymin = 0.f;
    const float ymax = 1.f;
    float xmin = decodeF32(texelFetch(commsA, ivec2(2, 0), 0));
    float xmax = decodeF32(texelFetch(commsA, ivec2(3, 0), 0));
    return clamp((log(data) - log(xmin)) / (log(xmax) - log(xmin)), 0.f, 1.f);
}
`;
export const aabbVS = `
#line 3 98

flat out vec3 diag;
flat out vec4 lower;

flat out vec3   sunPos;
flat out vec3 earthPos;

flat out int objectI;
flat out vec3 rayPos;
out vec3 boxPos;

vec3 act(mat4 m, vec3 v)
{
    vec4 u = m * vec4(v, 1.f);
    return u.xyz / u.w;
}

void main()
{
    int satI = cameraObjectID();
    objectI = int(satGroup(satI));

    AABB box = fetchObjectMainAABB(objectI);
    diag = box.pmax - box.pmin;
    lower = vec4(box.pmin, max(diag.x, max(diag.y, diag.z)) / 1e3f);

    // in inner coordinate system, box.pmin -> vec3(0, 0, 0), box.pmax -> vec3(1, 1, 1)
    mat4 innerToObj = mat4
    (
        vec4(diag.x, 0.f, 0.f, 0.f),
        vec4(0.f, diag.y, 0.f, 0.f),
        vec4(0.f, 0.f, diag.z, 0.f),
        lower
    );

    int i = int[]
    (
        0, 4, 6, 0, 6, 2, // -x
        1, 3, 7, 1, 7, 5, // +x
        0, 1, 5, 0, 5, 4, // -y
        2, 6, 7, 2, 7, 3, // +y
        0, 2, 3, 0, 3, 1, // -z
        4, 5, 7, 4, 7, 6  // +z
    )[gl_VertexID];

    boxPos = vec3
    (
        (i & 0x1) != 0 ? 1.f : 0.f,
        (i & 0x2) != 0 ? 1.f : 0.f,
        (i & 0x4) != 0 ? 1.f : 0.f
    );

    vec3 objPos = satPositionNow(satI);

    // object coordinate system:
    vec3 x = normalize(         satPositionNow(cameraObjectID()) );
    vec3 z = normalize(cross(x, satVelocityNow(cameraObjectID())));
    vec3 y = cross(z, x);

    /*
    mat4 objToECI = mat4
    (
        vec4(     x, 0.f),
        vec4(     y, 0.f),
        vec4(     z, 0.f),
        vec4(objPos, 1.f)
    );

    mat4 innerToECI = objToECI * innerToObj;
    mat3 ECItoObj = transpose(mat3(objToECI));

    vec3 pos = act(innerToECI, boxPos);
    gl_Position = vec4(cameraPixel(pos), 1.f);

    rayPos = act(inverse(innerToECI), cameraPos());

    earthPos = -(ECItoObj * satPositionNow(cameraObjectID()));
    sunPos = earthPos + ECItoObj * (fromEcliptic * eclipticPosition(sunEclipticCoord(now)));
    */

    mat4 objToECI = mat4
    (
        vec4(        x, 0.f),
        vec4(        y, 0.f),
        vec4(        z, 0.f),
        vec4(vec3(0.f), 1.f)
    );

    mat4 innerToECI = objToECI * innerToObj;
    mat3 ECItoObj = transpose(mat3(objToECI));

    mat3 B = cameraBasis();
    vec3 camPos = B[2] * camDist(mouse().z);
    vec3 dr = satPositionNow(satI) - satPositionNow(cameraObjectID());
    vec3 diff = act(innerToECI, boxPos) - camPos + dr;

    vec3 dir = transpose(B) * diff;
    vec2 xy = dir.xy / (fov(mouse().z) * vec2(aspectRatio, 1.f));
    float w = -dir.z;
    gl_Position = vec4(xy, toDepth(w) * w, w);

    rayPos = act(inverse(innerToECI), camPos);

    earthPos = -(ECItoObj * satPositionNow(cameraObjectID()));
    sunPos = earthPos + ECItoObj * (fromEcliptic * eclipticPosition(sunEclipticCoord(now)));
}
`;
export const commsLineVS = `
#line 3 103
flat out vec4 vColor;
flat out vec4 vIndex;
void main()
{
    int commsI = lookupCommsI(gl_InstanceID, now);
    CLIP_IF(commsI < 0 || commsI >= commsCount
         || commsVisibility(commsI) == false);

    CommsPack pack = fetchCommsPack(commsI);
    CLIP_IF(indexVisibility(pack.  sender) == false
         || indexVisibility(pack.receiver) == false);

    float k = timeUnlerp
    (
        TimeInterval(0.f, pack.ms0),
        TimeInterval(0.f, pack.ms1),
        timeDiff(timeSinceJ2000(now), TimeInterval(pack.days, 0.f))
    );
    CLIP_IF((0.f <= k && k <= 1.f) == false);

    vec3 pos = gl_VertexID == 0
        ? indexPositionNow(pack.  sender)
        : indexPositionNow(pack.receiver);
    gl_Position = vec4(cameraPixel(pos), 1.f);

    vColor = commsColor(commsI);
    vIndex = vec4(0.f);
}
`;
export const commsPointVS = `
#line 3 104
flat out float pointSize;
flat out uint pointShape;
flat out vec2 center;
flat out vec4 vColor;
flat out vec4 vIndex;
void main()
{
    int commsI = lookupCommsI(gl_InstanceID, now);
    CLIP_IF(commsI < 0 || commsI >= commsCount
         || commsVisibility(commsI) == false);

    CommsPack pack = fetchCommsPack(commsI);
    CLIP_IF(indexVisibility(pack.  sender) == false
         || indexVisibility(pack.receiver) == false);

    float k = timeUnlerp
    (
        TimeInterval(0.f, pack.ms0),
        TimeInterval(0.f, pack.ms1),
        timeDiff(timeSinceJ2000(now), TimeInterval(pack.days, 0.f))
    );
    CLIP_IF((0.f <= k && k <= 1.f) == false);

    vec3 pos = mix
    (
        indexPositionNow(pack.  sender),
        indexPositionNow(pack.receiver),
        k
    );
    vec3 vp = cameraPixel(pos);

    uint group = commsGroup(commsI);
    float size = groupPointNormalizedSize(group) * commsSizeMultiplier(pack.data);
    pointSize = pointScreenSize(max(commsPointMinimalSize(), size));

    pointShape = groupPointShape(group);
    center = 0.5f + 0.5f * vp.xy;
    vColor = groupColor(group);
    vIndex = packCommsIndex(commsI);

    gl_Position = vec4(vp, 1.f);
    gl_PointSize = pointSize;
}
`;
export const earthVS = `
#line 2 100
flat out vec3   sunPos;
flat out vec3  moonPos;
flat out vec3 earthPos;

void main()
{
    sunPos  = fromEcliptic * eclipticPosition( sunEclipticCoord(now));
    moonPos = fromEcliptic * eclipticPosition(moonEclipticCoord(now));
    earthPos = vec3(0.f);

    vec2 p = vec2[]
    (
        vec2(-1.f, -1.f),
        vec2(-1.f,  1.f),
        vec2( 1.f, -1.f),
        vec2( 1.f, -1.f),
        vec2(-1.f,  1.f),
        vec2( 1.f,  1.f)
    )[gl_VertexID];

    gl_Position = vec4(p, 0.f, 1.f);
}
`;
export const moonVS = `
#line 2 100
flat out vec3 sunDir;
flat out float sunAngle;

flat out vec3 moonPos;
flat out mat3 moonRot;

void main()
{
    EclipticCoord sunCoord = sunEclipticCoord(now);
    sunDir = fromEcliptic * toS2(sunCoord.coord);
    sunAngle = sunR / sunCoord.dist;

    EclipticCoord moonCoord = moonEclipticCoord(now);
    moonPos = moonCoord.dist * (fromEcliptic * toS2(moonCoord.coord));

    moonRot = fromEcliptic * moonRotation(now);

    vec3 pos = cameraPixel(moonPos);
    float camDist = length(moonPos - cameraPos());
    vec2 r = mainFramebufferSize.yx / mainFramebufferSize.xx / fov(mouse().z)
           * moonR * inversesqrt(camDist * camDist - moonR * moonR);

    vec2 p = vec2[]
    (
        vec2(-1.f, -1.f),
        vec2(-1.f,  1.f),
        vec2( 1.f, -1.f),
        vec2( 1.f, -1.f),
        vec2(-1.f,  1.f),
        vec2( 1.f,  1.f)
    )[gl_VertexID];

    gl_Position = vec4(pos + vec3(r * p, 0.f), 1.f);
}
`;
export const orbitVS = `
#line 2 106
uniform uint orbitPointCount;
flat out vec4 vColor;
flat out vec4 vIndex;
void main()
{
    CLIP_IF(satPointVisibility(gl_InstanceID) == false
         || satOrbitVisibility(gl_InstanceID) == false);

    vec7 v = vec7
    (
        satPositionNow(gl_InstanceID),
        satVelocityNow(gl_InstanceID),
        timeSinceJ2000(now)
    );
    Orbit orbit = orbitFromVec7(v);
    float E = orbitEccentricAnomaly(orbit, now);

    float k = float(gl_VertexID) / float(orbitPointCount);
    vec3 pos = orbitPoint(orbit, E + 2.f * pi * k);

    gl_Position = vec4(cameraPixel(pos), 1.f);
    vColor = satPointColor(gl_InstanceID);
    vIndex = vec4(0.f);
}
`;
export const polygonVS = `
#line 2 107
flat out vec4 vColor;
void main()
{
    vec2 uv = toUV(texelFetch(polygonA, ivec2(gl_VertexID, 0), 0).rg)
            - vec2(float(gl_InstanceID), 0.f);
    gl_Position = vec4(-1.f + 2.f * uv, 0.f, 1.f);
    vColor = vec4(one255, 0.f, 0.f, 0.f);
}
`;
export const quadVS = `
#line 2 108
out vec2 pos;
void main()
{
    pos = vec2[]
    (
        vec2(-1.f, -1.f),
        vec2(-1.f,  1.f),
        vec2( 1.f, -1.f),
        vec2( 1.f, -1.f),
        vec2(-1.f,  1.f),
        vec2( 1.f,  1.f)
    )[gl_VertexID];
    gl_Position = vec4(pos, 1.f, 1.f);
}
`;
export const satCaptureVS = `
#line 2 110
flat out vec4 vColor;
void main()
{
    CameraInfo info = cameraInfo(gl_InstanceID);
    CLIP_IF(satPointVisibility(info.satelliteID) == false
         || satRenderCapture  (info.satelliteID) == false);

    bool upper = bool[](false,  true, false, false,  true, true)[gl_VertexID % 6];
    bool right = bool[](false, false,  true,  true, false, true)[gl_VertexID % 6];

    vec3 p0 = satPositionNow(info.satelliteID);
    vec2 c0 = toUV(fromS2(rotateZ(GMST(now)) * normalize(p0)));

    float gmst = upper ? GMST(now) : GMST(prev);

    vec3 pos = upper
        ? p0
        : satPositionPrev(info.satelliteID);
    vec3 v = upper
        ? satVelocityNow (info.satelliteID)
        : satVelocityPrev(info.satelliteID);

    vec3 z = normalize(pos);
    vec3 y = normalize(v);
    vec3 x = normalize(cross(y, z));

    vec2 phi = info.captureOrientation;
    float k = upper ? phi.x : phi.y;
    float mid = (1.f - k) * info.viewAngle[0] + k * info.viewAngle[1];
    float w = info.captureAngle * 0.5f;

    float a = (gl_VertexID / 6) % 2 != 0
        ? (right ? mid + w : mid)
        : (right ? mid : mid - w);
    Ray ray = Ray
    (
        pos,
        sin(a) * x - cos(a) * z
    );

    const Sphere earth = Sphere(vec3(0.f), earthR);
    RayDistanceRange I = raySphereIntersection(ray, earth);
    vec3 p = rayPoint(ray, I.tNear);
    vec2 c = toUV(fromS2(rotateZ(gmst) * normalize(p)));

    if(c0.x > 0.75f || c0.x < 0.25f)
    {
        if(gl_VertexID < 12 && c.x > 0.5f)
            c.x -= 1.f;
        else if(gl_VertexID >= 12 && c.x < 0.5f)
            c.x += 1.f;
    }
    gl_Position = vec4(-1.f + 2.f * c, 0.f, 1.f);
    vColor = vec4(0.f, 0.f, 1.f, 0.f);
}
`;
export const satLineVS = `
#line 2 112
flat out vec4 vColor;
void main()
{
    CLIP_IF(satPointVisibility(gl_InstanceID) == false
         || satRenderLine     (gl_InstanceID) == false);

    vec3 pos0 = satPositionNow (gl_InstanceID);
    vec3 pos1 = satPositionPrev(gl_InstanceID);
    vec2 a0 = fromS2(rotateZ(GMST(now )) * normalize(pos0));
    vec2 a1 = fromS2(rotateZ(GMST(prev)) * normalize(pos1));
    vec2 c0 = toUV(a0);
    vec2 c1 = toUV(a1);
    const float du = 0.25f;
    if(c0.x < du && c1.x > 1.f - du)
    {
        if(gl_VertexID < 2)
            c1.x -= 1.f;
        else
            c0.x += 1.f;
    }
    if(c1.x < du && c0.x > 1.f - du)
    {
        if(gl_VertexID < 2)
            c0.x -= 1.f;
        else
            c1.x += 1.f;
    }
    vec2 c = gl_VertexID % 2 == 0 ? c0 : c1;
    gl_Position = vec4(-1.f + 2.f * c, 0.f, 1.f);
    vColor = vec4(1.f, 0.f, 0.f, 0.f);
}
`;
export const satViewVS = `
#line 2 113
flat out vec4 vColor;
void main()
{
    CameraInfo info = cameraInfo(gl_InstanceID);
    CLIP_IF(satPointVisibility(info.satelliteID) == false
         || satRenderView     (info.satelliteID) == false);

    bool upper = bool[](false,  true, false, false,  true, true)[gl_VertexID % 6];
    bool right = bool[](false, false,  true,  true, false, true)[gl_VertexID % 6];

    vec3 p0 = satPositionNow(info.satelliteID);
    vec2 c0 = toUV(fromS2(rotateZ(GMST(now)) * normalize(p0)));

    float gmst = upper ? GMST(now) : GMST(prev);

    vec3 pos = upper
        ? p0
        : satPositionPrev(info.satelliteID);
    vec3 v = upper
        ? satVelocityNow (info.satelliteID)
        : satVelocityPrev(info.satelliteID);

    vec3 z = normalize(pos);
    vec3 y = normalize(v);
    vec3 x = normalize(cross(y, z));

    float midAngle = 0.5f * (info.viewAngle[0] + info.viewAngle[1]);
    float a = (gl_VertexID / 6) % 2 != 0
        ? (right ? info.viewAngle[1] : midAngle)
        : (right ? midAngle : info.viewAngle[0]);
    Ray ray = Ray
    (
        pos,
        sin(a) * x - cos(a) * z
    );

    const Sphere earth = Sphere(vec3(0.f), earthR);
    RayDistanceRange I = raySphereIntersection(ray, earth);
    vec3 p = rayPoint(ray, I.tNear);
    vec2 c = toUV(fromS2(rotateZ(gmst) * normalize(p)));

    if(c0.x > 0.75f || c0.x < 0.25f)
    {
        if(gl_VertexID < 12 && c.x > 0.5f)
            c.x -= 1.f;
        else if(gl_VertexID >= 12 && c.x < 0.5f)
            c.x += 1.f;
    }
    gl_Position = vec4(-1.f + 2.f * c, 0.f, 1.f);
    vColor = vec4(0.f, 1.f, 0.f, 0.f);
}
`;
export const satelliteVS = `
#line 2 114
flat out float pointSize;
flat out uint pointShape;
flat out vec2 center;
flat out vec4 vColor;
flat out vec4 vIndex;
void main()
{
    CLIP_IF(satPointVisibility(gl_InstanceID) == false);

    vec3 pos = satPositionNow(gl_InstanceID);
    vec3 vp = cameraPixel(pos);

    pointSize = satPointSize(gl_InstanceID);
    pointShape = satPointShape(gl_InstanceID);
    center = 0.5f + 0.5f * vp.xy;
    vColor = vec4(satPointColor(gl_InstanceID).rgb, 1.f);
    vIndex = packSatIndex(gl_InstanceID);

    gl_Position = vec4(vp, 1.f);
    gl_PointSize = pointSize;
}
`;
export const stationVS = `
#line 2 115
flat out float pointSize;
flat out uint pointShape;
flat out vec2 center;
flat out vec4 vColor;
flat out vec4 vIndex;
void main()
{
    CLIP_IF(stationVisibility(gl_InstanceID) == false);

    vec3 pos = cameraPixel(stationPosition(gl_InstanceID, now));

    pointSize = stationPointSize(gl_InstanceID);
    pointShape = stationPointShape(gl_InstanceID);
    center = 0.5f + 0.5f * pos.xy;
    vColor = vec4(stationPointColor(gl_InstanceID).rgb, 1.f);
    vIndex = packStationIndex(gl_InstanceID);

    gl_Position = vec4(pos, 1.f);
    gl_PointSize = pointSize;
}
`;
export const viewTriangleVS = `
#line 2 118
void main()
{
    CameraInfo info = cameraInfo(gl_InstanceID);
    CLIP_IF(satPointVisibility(info.satelliteID) == false
         || satRenderView     (info.satelliteID) == false);

    vec3 pos0 = satPositionNow(info.satelliteID);
    if(gl_VertexID == 2)
        gl_Position = vec4(cameraPixel(pos0), 1.f);
    else
    {
        vec3 z = normalize(pos0);
        vec3 y = normalize(satVelocityNow(info.satelliteID));
        vec3 x = normalize(cross(y, z));
        y = cross(z, x);

        float a = info.viewAngle[gl_VertexID % 2];
        Ray ray = Ray
        (
            pos0,
            sin(a) * x - cos(a) * z
        );
        RayDistanceRange I = raySphereIntersection(ray, Sphere(vec3(0.f), earthR));

        float t = happened(I) ? I.tNear : length(pos0);
        gl_Position = vec4(cameraPixel(rayPoint(ray, t)), 1.f);
    }
}
`;
export const captureFS = `
#line 3 100

layout(location = 0) out uvec3 color;

void main()
{
    ivec2 framebufferExtent = ivec2
    (
        min(4096, cameraCount),
        int(ceil(float(cameraCount) / 4096.f))
    );
    ivec2 p = clamp(ivec2(gl_FragCoord.xy), ivec2(0), framebufferExtent - 1);
    int cameraI = p.y * 4096 + p.x;
    color = uvec3
    (
        floatBitsToUint(interpolatedAngle(cameraI, now )),
        floatBitsToUint(interpolatedAngle(cameraI, prev)),
        uint(indexV(lookupIndex(decodeU32(fetchCapturePixel(cameraCount + 2 + 4 * cameraI)))))
    );
}
`;
export const circleFS = `
#line 3 101

flat in vec2 center;
flat in float pointSize;
flat in uint pointShape;
flat in vec4 vColor;
flat in vec4 vIndex;

layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oIndex;

bool inside(vec2 a)
{
    switch(pointShape)
    {
        case 0u: return dot(a, a) < 0.25f;
        case 1u: return dot(a, a) < 0.25f && dot(a, a) > 0.1f;
        case 2u: return true;
        case 3u: return abs(a.x) > 0.3f || abs(a.y) > 0.3f;
        case 4u: return abs(a.x) + abs(a.y) < 0.5f;
        case 5u: return abs(a.x) + abs(a.y) < 0.5f && abs(a.x) + abs(a.y) > 0.35f;
        case 6u: return abs(a.x) - 0.5f * abs(a.y + 0.5f) < 0.05f;
        case 7u: return abs(a.x - a.y) < 0.15f || abs(a.x + a.y) < 0.15f;
        default: return false;
    }
}

void main()
{
    oColor = vec4(vColor.rgb, 0.f);
    oIndex = vIndex;
    for(uint i = 0u; i < 4u; ++i)
        if(inside((sample4(gl_FragCoord.xy - center * mainFramebufferSize)[i]) / pointSize))
            oColor.a += 0.25f;
}
`;
export const earthFS = `
#line 3 105

flat in vec3   sunPos;
flat in vec3  moonPos;
flat in vec3 earthPos;

layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oIndex;

const float     sunI = 1366.f;
const float   starsI =  200.f;
const float surfaceI =   80.f;
const float    gridI =   1.5f;

vec3 premultiply(vec4 color)
{
    return color.rgb * color.a;
}
vec3 surfaceColor(vec2 tex)
{
    vec4 surface = texture(surfaceA, tex);
    vec3 color = surface.r * premultiply(decodeColor(   satLineColor))
               + surface.g * premultiply(decodeColor(   satViewColor))
               + surface.b * premultiply(decodeColor(satCaptureColor));

    float a = texelFetch(surfaceA, ivec2(tex * surfaceFramebufferSize), 0).a;
    int region = int(255.f * a) - 1;
    if(region != -1 && regionVisibility(region))
    {
        oIndex = packRegionIndex(region);
        color += premultiply(regionColor(region));
    }
    return color;
}

vec3 earthColor(Ray ray)
{
    RayDistanceRange E = raySphereIntersection(ray, Sphere(earthPos, earthR));
    vec3 pos = rayPoint(ray, E.tNear);
    gl_FragDepth = min(gl_FragDepth, pointDepth(pos));

    vec3 norm = normalize(pos - earthPos);
    pos = earthPos + norm * earthR; // more precision? maybe

    vec2 tex = toUV(fromS2(rotateZ(GMST(now)) * norm));
    vec3 albedo = texture(earthA, tex).rgb
                + texture(bordrA, tex).r * premultiply(decodeColor(borderLineColor));

    bool isWater = albedo.r + albedo.g < albedo.b;
    float roughness = isWater ? 0.65f : 1.f;

    vec3 light = normalize(sunPos - earthPos);
    vec3 view = -ray.dir;
    vec3 halfway = normalize(light + view);

    const float e = 1e-4f;
    float NL = max(e, dot(norm,   light));
    float NV = max(e, dot(norm,    view));
    float NH = max(e, dot(norm, halfway));
    float HV = max(e, dot(halfway, view));

    float NDF = DistributionGGX(NH, roughness);
    float G = GeometrySmith(NV, NL, roughness);
    float specular = NDF * G / (4.f * NV * NL);

    vec3 F = FresnelSchlick(HV, vec3(0.02f));

    vec3 kIn  = exp(-rayleighOpticalDepth(earthR, dot(norm, light)));
    vec3 kOut = exp(-rayleighOpticalDepth(earthR, dot(norm,  view)));

    vec3 brdfD = albedo * (1.f - F) / pi;
    vec3 brdfS = F * specular;
    vec3 c = isPretty()
        ? ( (spectralToSRGB * (kOut * kIn)) * NL * (brdfD + brdfS)
          + brdfD * (spectralToSRGB * (kOut * skyI(dot(norm, light))))
          + spectralToSRGB * atmoFromEarth(Ray(pos, view), light)
          ) * lightVisibility(pos, Sphere(sunPos, sunR), Sphere(moonPos, moonR))
        : albedo / pi;
    if(abs(dot(norm, light)) < 1e-3f)
        c += surfaceI * premultiply(decodeColor(sunsetLineColor));

    return sunI * sunSpectral * c + surfaceColor(tex) * surfaceI;
}
vec3 atmoColor(Ray ray)
{
    RayDistanceRange A = raySphereIntersection(ray, Sphere(earthPos, earthR + atmoH));
    vec3 light = normalize(sunPos - earthPos);

    float tMid = 0.5f * (A.tNear + A.tFar);
    float dt = 0.4f * (A.tFar - tMid); // shortened
    vec3 pos = rayPoint(ray, tMid);

    vec3 a = atmo(Ray(pos - earthPos,  ray.dir), dt, light)
           + atmo(Ray(pos - earthPos, -ray.dir), dt, light);
    return isPretty()
        ? lightVisibility
        (
            pos,
            Sphere( sunPos,  sunR),
            Sphere(moonPos, moonR)
        ) * spectralToSRGB * (sunI * sunSpectral * a)
        : vec3(0.f);
}
vec3 sunColor(Ray ray)
{
    vec3 light = normalize(sunPos - ray.pos);
    float sunSin2 = sunR * sunR / (sunR * sunR + dot(sunPos - ray.pos, sunPos - ray.pos));

    float cosA = dot(ray.dir, light);
    float sinA = sqrt(1.f - cosA * cosA);
    float o = acos(cosA) * 180.f / pi;
    float o2 = o + 0.02f;

    float f0 = 0.384f * 2.f / sunSin2;
    float f1 = 0.478f * 20.91195f / (o2 * o2 * o2) * sinA;
    float f2 = 0.138f * 72.37457f / (o2 * o2) * sinA;

    bool onSun = cosA > 0.f && (1.f - cosA * cosA) < sunSin2;

    return sunSRGB * 20.f * (onSun ? f0 : f1 + f2);
}
vec3 starColor(Ray ray)
{
    vec2 uv = toUV(fromS2(ray.dir));
    uv = vec2(1.f - uv.x, uv.y);
    return starsI * texture(starsA, uv).rgb
         + starsI * texture(milkyA, uv).rgb * 0.05f
         +  gridI * texture( gridA, uv).rrr;
}

vec3 earthRayColor(Ray ray)
{
    RayDistanceRange E = raySphereIntersection(ray, Sphere(earthPos, earthR        ));
    RayDistanceRange A = raySphereIntersection(ray, Sphere(earthPos, earthR + atmoH));

    bool earthHit = happened(E);
    bool  atmoHit = happened(A);

    vec3 color = earthHit
        ? earthColor(ray)
        : sunColor(ray) + starColor(ray);
    return !earthHit && atmoHit
        ? color + atmoColor(ray)
        : color;
}

void main()
{
    gl_FragDepth = 1.f;
    oIndex = vec4(0.f);

    uint sampleCount = isMultisampled() ? 4u : 1u;
    vec2 p[4] = sample4(-1.f + 2.f * gl_FragCoord.xy / mainFramebufferSize.xy);

    vec4 color = vec4(0.f);
    for(uint i = 0u; i < sampleCount; ++i)
    {
        vec3 c = earthRayColor(cameraRay(p[i]));
        color += vec4(expose(c.rgb), 1.f);
    }
    color /= float(sampleCount);
    oColor = vec4(encodeSRGB(color.rgb), color.a);
}
`;
export const moonFS = `
#line 2 99
flat in vec3 sunDir;
flat in float sunAngle;
flat in vec3 moonPos;
flat in mat3 moonRot;

layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oIndex;

float moonBRDF(vec3 norm, vec3 eye, vec3 light)
{
    float cosPhi = dot(eye, light);
    float sinPhi = sqrt(1.f - cosPhi * cosPhi);
    float tanPhi = sinPhi / cosPhi;
    float cotPhi = cosPhi / sinPhi;

    float NV = dot(norm,   eye);
    float NL = dot(norm, light);

    const float g = 0.6f;
    float B = cosPhi > 0.f
        ? 2.f - (1.f - exp(-g * cotPhi)) * (3.f - exp(-g * cotPhi)) / (2.f * g * cotPhi)
        : 1.f;
    float S = (sinPhi + (pi - abs(atan(sinPhi, cosPhi))) * cosPhi) / pi + 0.1f * (1.f - 0.5f * cosPhi) * (1.f - 0.5f * cosPhi);
    return NL >= 0.f ? 2.f / (3.f * pi) * B * S / (1.f + NV / NL) : 0.f;
}
vec4 moonColor(Ray ray)
{
    Sphere moon = Sphere(moonPos, moonR);
    RayDistanceRange I = raySphereIntersection(ray, moon);

    if(happened(I))
    {
        vec3 p = ray.pos + ray.dir * I.tNear;
        gl_FragDepth = min(gl_FragDepth, pointDepth(p));

        vec3 earthDir = normalize(-p);
        vec3 norm = normalize(p - moonPos);
        vec2 tex = toUV(fromS2(moonRot * norm));
        vec3 albedo = vec3(1.35f, 1.f, 0.7f) * texture(moonA, tex).r / pi;

        float L = lightVisibility
        (
            p,
            Sphere(sunDir * (sunR / sunAngle), sunR),
            Sphere(vec3(0.f), earthR)
        ) * 1905.f * moonBRDF(norm, -ray.dir, sunDir);

        // earthshine:
        float cosPhase = dot(-ray.dir, sunDir);
        float sinPhase = sqrt(1.f - cosPhase * cosPhase);
        float a = pi - atan(sinPhase, cosPhase);
        float E = 20.f * moonBRDF(norm, -ray.dir, earthDir) * (1.f + sin(a * 0.5f) * tan(a * 0.5f) * log(tan(a * 0.25f)));

        return vec4(albedo * (L + E), 1.f);
    }
    return vec4(0.f);
}
void main()
{
    gl_FragDepth = 1.f;
    vec2 p[4] = sample4(-1.f + 2.f * gl_FragCoord.xy / mainFramebufferSize.xy);

    vec3 color = vec3(0.f);
    float alpha = 0.f;
    for(uint i = 0u; i < 4u; ++i)
    {
        vec4 c = moonColor(cameraRay(p[i]));
        color += expose(c.rgb);
        alpha += c.a * 0.25f;
    }

    oColor = vec4(encodeSRGB(0.25f * color), alpha);
    oIndex = vec4(0.f);
}
`;
export const objectFS = `
#line 2 113

flat in vec3 diag;
flat in vec4 lower;

flat in vec3   sunPos;
flat in vec3 earthPos;

flat in int objectI;

flat in vec3 rayPos;
in vec3 boxPos;

layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oIndex;

vec3 innerToObj(vec3 v)
{
    return (v * diag + lower.xyz) / lower.w;
}
vec3 innerToObjDir(vec3 v)
{
    return normalize(v * diag);
}
vec3 objToInnerDir(vec3 v)
{
    return normalize(v / diag);
}

vec3 offsetPoint(vec3 pos, vec3 norm)
{
    const float intScale = 256.f;
    const float floatScale = 1.f / 65536.f;
    const float origin = 1.f / 32.f;

    vec3 n = norm * intScale;
    ivec3 of = ivec3(int(n.x), int(n.y), int(n.z));
    vec3 p = vec3
    (
        intBitsToFloat(floatBitsToInt(pos.x) + (pos.x < 0.f ? -of[0] : of[0])),
        intBitsToFloat(floatBitsToInt(pos.y) + (pos.y < 0.f ? -of[1] : of[1])),
        intBitsToFloat(floatBitsToInt(pos.z) + (pos.z < 0.f ? -of[2] : of[2]))
    );
    return vec3
    (
        abs(pos.x) < origin ? pos.x + floatScale * n.x : p.x,
        abs(pos.y) < origin ? pos.y + floatScale * n.y : p.y,
        abs(pos.z) < origin ? pos.z + floatScale * n.z : p.z
    );
}
vec4 color(Ray ray)
{
    RayObjectIntersection i = rayObjectIntersection(objectI, ray, RayDistanceRange(0.f, 100.f));

    if(!happened(i))
        return vec4(0.f);

    Triangle t = fetchObjectTriangle(objectI, i.triangleID);
    vec3 norm = fetchObjectNorm(objectI, i.triangleID, i.rti);
    vec3 pos = ray.pos + ray.dir * i.rti.t;

    vec3 light = normalize(sunPos - pos);
    Ray shadowRay = Ray(offsetPoint(pos, 8.f * norm), objToInnerDir(light));

    float shadowMult = happened(rayObjectIntersection(objectI, shadowRay, RayDistanceRange(0.f, 4.f)))
        ? 0.f
        : lightVisibility
        (
            innerToObj(shadowRay.pos),
            Sphere(  sunPos,   sunR),
            Sphere(earthPos, earthR)
        );

    Material material = fetchTriangleMaterial(objectI, i.triangleID);

    norm = innerToObjDir(norm);
    vec3 view = innerToObjDir(-ray.dir);
    vec3 halfway = normalize(light + view);

    const float e = 1e-4f;
    float NL = max(e, dot(norm,    light));
    float NV = max(e, dot(norm,     view));
    float NH = max(e, dot(norm,  halfway));
    float HV = max(e, dot(halfway,  view));
    float LH = max(e, dot(light, halfway));

    vec3 ambient = material.albedo * max(e, dot(norm, view));

    if(isPretty())
    {
        float NDF = DistributionGGX(NH, material.roughness);
        float G = GeometrySmith(NV, NL, material.roughness);
        float specular = NDF * G / (4.f * NV * NL);

        vec3 F = FresnelSchlick(HV, mix(vec3(0.04f), material.albedo, material.metalness));

        vec3 brdfD = material.albedo * (1.f - F) * (1.f - material.metalness) / pi;
        vec3 brdfS = F * specular;

        return vec4(ambient + shadowMult * 1300.f * NL * (brdfD + brdfS), 1.f);
    }
    else
        return vec4(ambient * 100.f, 1.f);
}
void main()
{
    vec4 accum = vec4(0.f);
    vec3[4] pos = sample4(boxPos);
    uint sampleCount = isMultisampled() ? 4u : 1u;
    for(uint i = 0u; i < sampleCount; ++i)
    {
        vec4 c = color(Ray(rayPos, normalize(pos[i] - rayPos)));
        accum += vec4(expose(c.rgb), c.a) / float(sampleCount);
    }
    if(accum.a == 0.f)
        discard;
    oColor = vec4(encodeSRGB(accum.rgb / accum.a), accum.a);
    oIndex = vec4(0.f);
}
`;
export const regionFS = `
#line 2 109

in vec2 pos;

layout(location = 0) out vec4 color;

uniform int idx;

void main()
{
    bool inside = int(texture(regionA, 0.5f + 0.5f * pos).r * 255.f) % 2 == 1;
    if(!inside)
        discard;
    color = vec4(0.f, 0.f, 0.f, float(idx + 1) * one255);
}
`;
export const satCoordFS = `
#line 3 111
layout(location = 0) out uvec4 color;
void main()
{
    ivec2 framebufferExtent = ivec2
    (
        min(4096, satelliteCount),
        4 * int(ceil(float(satelliteCount) / 4096.f))
    );
    ivec2 p = clamp(ivec2(gl_FragCoord.xy), ivec2(0), framebufferExtent - 1);
    int satI = p.x + (p.y / 4) * 4096;
    switch(p.y % 4)
    {
        case 0: color.rgb = floatBitsToUint(interpolatedOrbitPoint   (satI, now )); break;
        case 1: color.rgb = floatBitsToUint(interpolatedOrbitVelocity(satI, now )); break;
        case 2: color.rgb = floatBitsToUint(interpolatedOrbitPoint   (satI, prev)); break;
        case 3: color.rgb = floatBitsToUint(interpolatedOrbitVelocity(satI, prev)); break;
    }
}
`;
export const uColorFS = `
#line 2 116
uniform vec4 uColor;
layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oIndex;
void main()
{
    oColor = uColor;
    oIndex = vec4(0.f);
}
`;
export const vColorFS = `
#line 2 117
flat in vec4 vColor;
layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oIndex;
void main()
{
    oColor = vColor;
    oIndex = vec4(0.f);
}
`;
