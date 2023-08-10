import { ABI } from '../utils/abi/board'

export const boardContractConfig = {
  address: import.meta.env.VITE_BOARD_CONTRACT,
  abi: ABI,
} as const
