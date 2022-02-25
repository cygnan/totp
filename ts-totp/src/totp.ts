// interface Array<T> {
//     flat(this: number[][]): number[];
// }

(() => {
    // const secret: string = 'XXXXXXXXXXXXXXXX';
    const secret: string = 'JBSWY3DPEHPK3PXP';

    // Array.prototype.flat = function () {
    //     return [].concat(...this);
    // };

    const decodeBase32 = (s: string): Int8Array => {
        let secretDecodedNotCut: number[] = [];
        for (let i = 0; i < 8; i++) {
            let values5Bit: number[] = [];
            for (let j = 0; j < 8; j++) {
                const valueBase32: number = s.charCodeAt(i * 8 + j);
                const value5Bit: number = valueBase32 < 65 ? valueBase32 - 24 : valueBase32 - 65;
                values5Bit.push(value5Bit);
            }
            const values8Bit = [(values5Bit[0] << 3) | (values5Bit[1] >> 2),
                (values5Bit[1] << 6) | (values5Bit[2] << 1) | (values5Bit[3] >> 4),
                (values5Bit[3] << 4) | (values5Bit[4] >> 1),
                (values5Bit[4] << 7) | (values5Bit[5] << 2) | (values5Bit[6] >> 3),
                (values5Bit[6] << 5) | (values5Bit[7] >> 0)
            ];
            secretDecodedNotCut.push(...values8Bit);
        }
        return new Int8Array(secretDecodedNotCut);
    }

    const truncate = (dv: DataView) => dv.getUint32(dv.getInt8(19) & 0x0f) & 0x7fffffff;
    const counter = Math.floor(Date.now() / 1000 / 30);

    const secretDecoded = decodeBase32(secret);
    crypto.subtle.importKey('raw', secretDecoded, {
        name: 'HMAC',
        hash: {name: 'SHA-1'}
    }, true, ['sign'])
        .then(k => crypto.subtle.sign('HMAC', k, new Int8Array([0, 0, 0, 0, counter >> 24, counter >> 16, counter >> 8, counter])))
        .then(h => {
            run(('00000' + truncate(new DataView(h))).slice(-6));
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
