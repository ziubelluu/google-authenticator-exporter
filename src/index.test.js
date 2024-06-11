import { assert, describe, expect, it } from 'vitest'
import testQrCodes from '../test-assets/test-qr-codes.json'
import { decodeExportUri } from "./index.js"

describe("Protobuff decoding of QR export data", () => {

    it("Should decode single QR export", () => {
        // Given
        const export1 = testQrCodes['Google-auth-test-qr.png']

        // When
        console.error(testQrCodes)

        const actualAccounts = decodeExportUri(export1)

        // Then
        expect(actualAccounts).toHaveLength(3)

        expect(actualAccounts[0]).toEqual({
            "algorithm": "ALGO_SHA1",
            "digits": 1,
            "name": "Test account 1",
            "secret": "SGVsbA8h3q2+6A==",
            "totpSecret": "JBSWY3APEHPK3PXI",
            "type": "OTP_TOTP",
        })

        expect(actualAccounts[2]).toEqual({
            "algorithm": "ALGO_SHA1",
            "counter": "1",
            "digits": 1,
            "name": "Counter key 1",
            "secret": "AESNbGQvO+MdHw==",
            "totpSecret": "ABCI23DEF456GHI7",
            "type": "OTP_HOTP",
        })
    })


    it("Should decode payload exported as 2 QR codes", () => {
        // Given
        const export1 = testQrCodes['Google-auth-test2-qr1.png']
        const export2 = testQrCodes['Google-auth-test2-qr2.png']

        // When
        const actualAccounts1 = decodeExportUri(export1)
        const actualAccounts2 = decodeExportUri(export2)

        // Then
        expect(actualAccounts1).toHaveLength(10)
        expect(actualAccounts2).toHaveLength(2)
    })

    it("Should decode export with SHA512 and 8 digit length code", () => {
        // Given
        const export1 = testQrCodes['Google-auth-test-sha512-8digit.png']

        // When
        console.error(testQrCodes)

        const actualAccounts = decodeExportUri(export1)

        // Then
        expect(actualAccounts).toHaveLength(1)

        expect(actualAccounts[0]).toEqual({
            "algorithm": 3,
            "digits": 2,
            "issuer": "TOTPgenerator",
            "name": "TOTPgenerator",
            "secret": "PWPBFOArrFMYoDSB1NZoYx5vGZM=",
            "totpSecret": "HVR4CFHAFOWFGGFAGSA5JVTIMMPG6GMT",
            "type": "OTP_TOTP"
        })
    })
})