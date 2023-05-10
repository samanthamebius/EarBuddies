const localStorageMock = {
    getItem: (key) => {
      return localStorageMock[key];
    },
    setItem: (key, value) => {
      localStorageMock[key] = value.toString();
    },
    removeItem: (key) => {
      delete localStorageMock[key];
    },
    clear: () => {
      localStorageMock = {};
    }
  };
  
  export default localStorageMock;