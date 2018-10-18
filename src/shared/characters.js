import trim from 'trim'
import md5 from 'md5'
import seedrandom from 'seedrandom'
import { HEAD_COUNT, FEMALE_HAIR_COUNT, MALE_HAIR_COUNT, START_ARMOR } from './consts'

const RND_KEY = 'asdasldkopasi09d83lk'

function femaleName(name) {
  if (name.length == 0) {
    return true
  }
  let lastLetter = name[name.length-1]
  return lastLetter == 'a' || lastLetter == 'i'
}

export function nameToBodyParts(name) {
  name = trim(name.toLowerCase())
  let hash = md5(name + RND_KEY)
  let rng = seedrandom(hash)
  let male = !femaleName(name)
  let hairCount = male ? MALE_HAIR_COUNT : FEMALE_HAIR_COUNT
  let armor =  Math.round(rng() * START_ARMOR)
  return {
    body: {
      head: Math.round(rng() * (HEAD_COUNT - 1)),
      hair: Math.round(rng() * (hairCount - 1)),
      male
    },
    equipment: {
      armor
    }
  }
}
