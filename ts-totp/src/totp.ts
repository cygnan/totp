// interface Array<T> {
//     flat(this: number[][]): number[];
// }

(() => {
    // const secret: string = 'XXXXXXXXXXXXXXXX';
    const secret: string = 'JBSWY3DPEHPK3PXP';

    // Array.prototype.flat = function () {
    //     return [].concat(...this);
    // };

    const b32 = (s: string) => {
        let arr: number[] = [];
        for (let i = 0; i < 8; i++) {
            let value5Bits: number[] = [];
            for (let j = 0; j < 8; j++) {
                let value_base32 = s.charCodeAt(i * 8 + j);
                let value5Bit: number = value_base32 < 65 ? value_base32 - 24 : value_base32 - 65;
                value5Bits.push(value5Bit);
            }
            let value8Bit = [(value5Bits[0] << 3) + (value5Bits[1] >> 2),
                (value5Bits[1] << 6) + (value5Bits[2] << 1) + (value5Bits[3] >> 4),
                (value5Bits[3] << 4) + (value5Bits[4] >> 1),
                (value5Bits[4] << 7) + (value5Bits[5] << 2) + (value5Bits[6] >> 3),
                (value5Bits[6] << 5) + (value5Bits[7] >> 0)
            ];
            arr.push(...value8Bit);
        }
        return arr;
    }

    const trunc = (dv: DataView) => dv.getUint32(dv.getInt8(19) & 0x0f) & 0x7fffffff;
    const c = Math.floor(Date.now() / 1000 / 30);

    crypto.subtle.importKey('raw', new Int8Array(b32(secret)), {
        name: 'HMAC',
        hash: {name: 'SHA-1'}
    }, true, ['sign'])
        .then(k => crypto.subtle.sign('HMAC', k, new Int8Array([0, 0, 0, 0, c >> 24, c >> 16, c >> 8, c])))
        // .then(h => document.querySelector('#mfacode').value = ('0' + trunc(new DataView(h))).slice(-6))
        .then(h => {
            run(('0' + trunc(new DataView(h))).slice(-6));
        });

    const run = (otp: string) => {
        const e = (<HTMLInputElement>document.querySelector('#token'));
        if (e && e.value != otp) {
            e.value = otp;
        } else {
            prompt('One-Time Password', otp);
            // console.log(otp);
        }
    };
})();
