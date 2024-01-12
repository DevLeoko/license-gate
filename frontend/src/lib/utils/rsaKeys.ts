import NodeRSA from 'node-rsa'

export function generateRsaKeyPair() {
	const key = new NodeRSA({ b: 2048 })

	return {
		rsaPublicKey: key.exportKey('pkcs8-public'),
		rsaPrivateKey: key.exportKey('pkcs8-private'),
	}
}
