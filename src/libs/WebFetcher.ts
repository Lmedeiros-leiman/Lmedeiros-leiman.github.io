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

const defaultConfig: WebFetcherConfig = {
    cache: true,
    cacheTime: 1000 * 60 * 30, // 30 minutes by default
    cacheStorage: "Default",
    target: "json"
}

export const WebFetcher = async (url: string, configurations: Partial<WebFetcherConfig> = defaultConfig) => {
    const config: WebFetcherConfig = { ...defaultConfig, ...configurations }

    const cacheStorage = await caches.open(config.cacheStorage);
    const cachedResult = await cacheStorage.match(url);

    if (cachedResult) {
        const cachedTimestamp = cachedResult.headers.get("X-Timestramp");

        if (cachedTimestamp && (parseInt(cachedTimestamp) < (new Date().getTime()))) {

            let data = undefined
            switch (config.target) {
                case "json":
                    data = await cachedResult.json();
                    break;
                case "text":
                    data = await cachedResult.text();
                    break;
                case "blob":
                    data = await cachedResult.blob();
                    break;
            }
            return data
        } else {
            // deletes the stale data
            await cacheStorage.delete(url)
        }
    }



    // if the data is not already in storaged (or failed to fetch), fetch it from the web
    const fetchedData = await fetch(url);

    if (fetchedData.status >= 200 && fetchedData.status <= 400) {

        let data = undefined
        // saves the request on the cache.
        let response = fetchedData.clone();
        const header = new Headers(response.headers)
        header.set("X-Timestamp", String(new Date().getTime() + config.cacheTime) )
        response = new Response(response.body, {headers: header});

        if (config.cache) {
            await cacheStorage.put(url, response)
        }
        
        switch (config.target) {
            case "json":
                data = await fetchedData.json();
                break;
            case "text":
                data = await fetchedData.text();
                break;
            case "blob":
                data = await fetchedData.blob();
                break;
        }

        return data
    }

    return fetchedData
}