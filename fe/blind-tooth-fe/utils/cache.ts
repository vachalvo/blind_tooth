export type ResponseData = {
  newSignalAvg: number;
  oldSignalAvg: number;
  lastItem?: {
    created: number;
  };
};

let cache: ResponseData = {
  newSignalAvg: 0,
  oldSignalAvg: 0,
  lastItem: {
    created: 0,
  },
};

export function useCache() {
  function storeData(data: ResponseData) {
    cache = data;
  }

  function getData() {
    return cache;
  }

  function isStale(cache: ResponseData) {
    return Date.now() - (cache.lastItem?.created ?? 0) > 7000;
  }

  function isEmpty(cache: ResponseData) {
    return !cache.lastItem?.created;
  }

  return { storeData, getData, isStale, isEmpty };
}
