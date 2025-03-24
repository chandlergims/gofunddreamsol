interface Window {
  ethereum?: any;
}

// For mongoose global caching
declare namespace NodeJS {
  interface Global {
    mongoose: {
      conn: any;
      promise: any;
    };
  }
}

declare const global: NodeJS.Global;
