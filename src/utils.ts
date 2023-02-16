const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const randomRangeExcept = (min: number, max: number, except: number[]) => {
  except.sort((a: number, b: number) => {
    return a - b
  })
  var random = Math.floor(Math.random() * (max - min + 1 - except.length)) + min
  var i
  for (i = 0; i < except.length; i++) {
    if (except[i] > random) {
      break
    }
    random++
  }
  return random
}

export { randomRange, randomRangeExcept }
