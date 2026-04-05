// web/src/lib/levelHelpers.ts

export const MIN_BALANCE_TO_PLAY = 2500

export const getWalletBalance = (): number => {
  const bal = localStorage.getItem('veltrix_wallet_balance')
  return bal ? parseFloat(bal) : 0
}

export const setWalletBalance = (amount: number) => {
  localStorage.setItem('veltrix_wallet_balance', amount.toString())
}

export const getUnlockedLevel = (): number => {
  const level = localStorage.getItem('veltrix_unlocked_level')
  return level ? parseInt(level) : 0
}

export const setUnlockedLevel = (level: number) => {
  localStorage.setItem('veltrix_unlocked_level', level.toString())
}

export const isLevelUnlocked = (level: number): boolean => {
  return getUnlockedLevel() >= level
}

export const canPlayAnyGame = (): boolean => {
  return getWalletBalance() >= MIN_BALANCE_TO_PLAY && getUnlockedLevel() > 0
}

export const hasMinimumBalance = (): boolean => {
  return getWalletBalance() >= MIN_BALANCE_TO_PLAY
}
