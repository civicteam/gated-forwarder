export const trimAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

export const errorMessage = (error: any) : string => error?.message ? error.message : JSON.stringify(error)
