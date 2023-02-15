const useStorage = () => {
  const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const getItem = (key: string) => JSON.parse(localStorage.getItem(key) || '{}')

  return {
    setItem,
    getItem,
  }
}

export { useStorage }
