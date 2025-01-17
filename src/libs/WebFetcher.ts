// A simple tool for fetching data on the web and cacheing the results.
// 
//
//
//
//

export type WebFetcherConfig = {
    cache: boolean
    cacheTime: number // in Miliseconds
    cacheStorage: "Default" | string
    target: "json" | "text" | "blob"
}

const defaultConfig : WebFetcherConfig = {
    cache: true,
    cacheTime: 1000 * 60 * 30, // 30 minutes
    cacheStorage: "Default",
    target: "json"
}

export const WebFetcher = async (url : string, config : WebFetcherConfig = defaultConfig) => {
    
    const cacheStorage = await caches.open(config.cacheStorage);
    const cachedResult = await cacheStorage.match(url);
    
    if (cachedResult) { 
        const cacheData = await cachedResult.json();
        return cacheData;
    } 

    // if the data is not already in storaged (or failed to fetch), fetch it from the web
    const fetchData = await fetch(url);




    return fetchData
}