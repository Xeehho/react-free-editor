import { createContext, useContext } from 'react'
import type { CustomBlockItem } from '../types'

export const CustomBlocksContext = createContext<CustomBlockItem[]>([])

export function useCustomBlocks() {
  return useContext(CustomBlocksContext)
}
