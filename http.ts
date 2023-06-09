type Fetch = typeof fetch;
type FetchParams = Parameters<Fetch>;

/**
 * Simple fetch wrapper for working with JSON HTTP endpoints.
 * It will raise error when `response.ok !== true` so you can catch API errors as usual.
 *
 * @example
 * ```ts
 * const api = getClient(fetch, { headers: { 'X-Auth-Dog': '123doggod321' } });
 * const dogs = await api('https://api.dogs.awesome') // => { dogs: [ { name: 'Rex' }, { name: 'Bella' } ] }
 * ````
 */
export function getClient(fetch: Fetch, defaultOpts?: FetchParams[1]) {
  return async <T extends Record<string, unknown>>(
    ...params: FetchParams
  ): Promise<T | string> => {
    let init = params[1];
    if (defaultOpts) {
      init = { ...defaultOpts, ...init };
    }
    const res = await fetch(params[0], init);

    const isJson = res.headers.get("content-type")?.includes(
      "application/json",
    );
    const result = isJson ? (await res.json() as T) : await res.text();

    if (res.ok) {
      return result;
    } else {
      throw new Error(
        `Request to ${res.url} failed with status ${res.status} and response "${
          isJson ? JSON.stringify(res.body) : result
        }".`,
      );
    }
  };
}

/**
 * Creates 'Ok' Response
 *
 * @xample
 * ```ts
 * return created ? ok(201, 'Created') : ok();
 * ```
 */
export const ok = (status = 200, msg = "Ok") => new Response(msg, { status });

/**
 * Creates 'Error' Response
 *
 * @xample
 * ```ts
 * return err(404, 'Not Found');
 * ```
 */
export const err = (status = 400, msg = "Bad Request") =>
  new Response(msg, { status });
