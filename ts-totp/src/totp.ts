interface Array<T> {
    flat(this: number[][]): number[];
}

(() => {
    const secret: string = 'XXXXXXXXXXXXXXXX';

    Array.prototype.flat = function () {
        return [].concat(...this);
    };

    const b32 = (s: string) =>
            [0, 8, 16, 24, 32, 40, 48, 56]
            .map(i => [0, 1, 2, 3, 4, 5, 6, 7]
                .map(j => s.charCodeAt(i + j)).map(c => c < 65 ? c - 24 : c - 65))
            .map(a => [(a[0] << 3) + (a[1] >> 2),
                (a[1] << 6) + (a[2] << 1) + (a[3] >> 4),
                (a[3] << 4) + (a[4] >> 1),
                (a[4] << 7) + (a[5] << 2) + (a[6] >> 3),
                (a[6] << 5) + (a[7] >> 0),
            ]).flat(),
        trunc = (dv: DataView) => dv.getUint32(dv.getInt8(19) & 0x0f) & 0x7fffffff,
        c = Math.floor(Date.now() / 1000 / 30);
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
