export type ResponseData = {
  newSignalAvg: number;
  oldSignalAvg: number;
  lastTimestamp: number;
};

let cache: ResponseData = {
  newSignalAvg: 0,
  oldSignalAvg: 0,
  lastTimestamp: 0,
};

export function useCache() {
  function storeData(data: ResponseData) {
    cache = data;
  }

  function getData() {
    return cache;
  }

  function isStale(cache: ResponseData) {
    return Date.now() - cache.lastTimestamp > 7000;
  }

  function isEmpty(cache: ResponseData) {
    return cache.lastTimestamp === 0;
  }

  return { storeData, getData, isStale, isEmpty };
}
