import Crypto from 'crypto'

export function playerUUID() {
   return 'p:' + Crypto.randomBytes(3).toString('hex')
}

export function entityUUID() {
   return 'e:' + Crypto.randomBytes(3).toString('hex')
}
