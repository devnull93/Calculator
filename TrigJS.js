class Trig {
    static PI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421;

    static factorial(n) {
         if (n < 0) return NaN;
         if (n === 0 || n === 1) return 1;

         let result = 1;
         for (let i = 2; i <= n; i++) {
              result *= i;
         }
         return result;
    }

    static power(base, exponent) {
         if (exponent === 0) return 1;
         if (base === 0 && exponent > 0) return 0;

         let result = 1;
         const absExponent = exponent < 0 ? -exponent : exponent;

         for (let i = 0; i < absExponent; i++) {
              result *= base;
         }
         return exponent < 0 ? 1 / result : result;
    }

    static abs(x) {
         return x < 0 ? -x : x;
    }

    static sqrt(x) {
         if (x < 0) return NaN;
         if (x === 0 || x === 1) return x;

         let guess = x / 2;
         const TOLERANCE = 1e-15;
         let difference = Infinity;
         while(difference > TOLERANCE) {
             const newGuess = (guess + x / guess) / 2;
             difference = Trig.abs(guess - newGuess);
             guess = newGuess;
         }
         return guess;
    }

    static log(x) {
         if (x <= 0) return NaN;

         let sum = 0;
         const ratio = (x - 1) / (x + 1);
         const PRECISION_TERMS = 50;

         for (let n = 0; n < PRECISION_TERMS; n++) {
              const exponent = 2 * n + 1;
              sum += Trig.power(ratio, exponent) / exponent;
         }
         return 2 * sum;
    }

    static exp(x) {
         if (x === 0) return 1;

         let sum = 1;
         let term = 1;
         const PRECISION_TERMS = 50;

         for (let n = 1; n < PRECISION_TERMS; n++) {
              term *= x / n;
              sum += term;
         }
         return sum;
    }

    static max(...values) {
         if (values.length === 0) return -Infinity;
         if (values.length === 1) return values[0];

         let currentMax = values[0];
         for (let i = 1; i < values.length; i++) {
              if (values[i] > currentMax) {
                  currentMax = values[i];
              }
         }
         return currentMax;
    }

    static min(...values) {
         if (values.length === 0) return Infinity;
         if (values.length === 1) return values[0];

         let currentMin = values[0];
         for (let i = 1; i < values.length; i++) {
              if (values[i] < currentMin) {
                  currentMin = values[i];
              }
         }
         return currentMin;
    }

    static #normalizeRadians(rad) {
         const TWO_PI = Trig.PI * 2;
         let normalized = rad % TWO_PI;

         if (normalized < 0) {
             normalized += TWO_PI;
         }
         return normalized;
    }

    static #clamp(value, min, max) {
         if (value < min) return min;
         if (value > max) return max;
         return value;
    }

    static sin(rad) {
         rad = Trig.#normalizeRadians(rad);
         const HALF_PI = Trig.PI / 2;
         const PI = Trig.PI;
         const TWO_PI = Trig.PI * 2;
         if (rad > PI) rad = rad - TWO_PI;
         if (rad > HALF_PI) rad = PI - rad;
         if (rad < -HALF_PI) rad = -PI - rad;
         let sum = 0;
         const PRECISION_TERMS = 15;

         for (let n = 0; n < PRECISION_TERMS; n++) {
              const sign = n % 2 === 0 ? 1 : -1;
              const exponent = 2 * n + 1;
              sum += sign * Trig.power(rad, exponent) / Trig.factorial(exponent);
         }
         return sum;
    }

    static cos(rad) {
         return Trig.sin(rad + Trig.PI / 2);
    }

    static tan(rad) {
         const sine = Trig.sin(rad);
         const cosine = Trig.cos(rad);
         if (cosine === 0) {
             return sine > 0 ? Infinity : -Infinity;
         }
         return sine / cosine;
    }

    static asin(x) {
         x = Trig.#clamp(x, -1, 1);
         let sum = 0;
         const PRECISION_TERMS = 15;

         for (let n = 0; n < PRECISION_TERMS; n++) {
              const numerator = Trig.factorial(2 * n);
              const denominator = Trig.power(4, n) * Trig.power(Trig.factorial(n), 2) * (2 * n + 1);
              sum += (numerator / denominator) * Trig.power(x, 2 * n + 1);
         }
         return sum;
    }

    static acos(x) {
         x = Trig.#clamp(x, -1, 1);
         return Trig.PI / 2 - Trig.asin(x);
    }

    static atan(x) {
         if (x === 0) return 0;
         if (x === Infinity) return Trig.PI / 2;
         if (x === -Infinity) return -Trig.PI / 2;
         if (x > 1) return Trig.PI / 2 - Trig.atan(1 / x);
         if (x < -1) return -Trig.PI / 2 - Trig.atan(1 / x);
         let sum = 0;
         const PRECISION_TERMS = 15;

         for (let n = 0; n < PRECISION_TERMS; n++) {
              const sign = n % 2 === 0 ? 1 : -1;
              sum += sign * Trig.power(x, 2 * n + 1) / (2 * n + 1);
         }
         return sum;
    }

    static atan2(y, x) {
         if (x > 0) {
             return Trig.atan(y / x);
         }

         if (x < 0 && y >= 0) {
             return Trig.atan(y / x) + Trig.PI;
         }

         if (x < 0 && y < 0) {
             return Trig.atan(y / x) - Trig.PI;
         }

         if (x === 0 && y > 0) {
             return Trig.PI / 2;
         }

         if (x === 0 && y < 0) {
             return -Trig.PI / 2;
         }
         return 0;
    }
}