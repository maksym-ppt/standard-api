export * as Lens from "./lens";
import { z } from "zod";
import { getJson } from "serpapi";
import { Config } from "sst/node/config";


export async function search(url: string) {
  
  const response = await getJson({
    engine: "google_lens",
    url: url,
    api_key: Config.SERP_API_KEY
  });

  return { props: { loaded: true, result: response } };
}


export async function analyzeImage(url: string) {
  
  const response = await getJson({
    engine: "google_lens",
    url: url,
    api_key: Config.SERP_API_KEY
  });

  console.log(response)

  // return { props: { loaded: true, result: response } };
}
