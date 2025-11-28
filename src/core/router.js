import Url from 'url'

export class Router {

  get = this.#registerRouteFor('get');
  post = this.#registerRouteFor('post');
  patch = this.#registerRouteFor('patch');
  put = this.#registerRouteFor('put');
  delete = this.#registerRouteFor('delete');

  constructor() {
    this.routeList = [];
  }

  #registerRouteFor(method) {
    return (path, callbackFunc) => {

      if (!path || !method) {
        throw new Error('method or path should be non-empty.')
      }
      const formattedMethod = method.trim().toUpperCase()

      // validations
      if (typeof method !== 'string' || typeof path !== 'string') {
        throw new Error("method or pathname is string.");
      }
      if (typeof callbackFunc !== 'function') {
        throw new Error(`${callbackFunc?.name || 'callback function'} is not a function`);
      }
      if (!['GET', 'POST', 'DELETE', 'PUT', 'PATCH'].includes(formattedMethod)) {
        throw new Error('Please provide correct http method');
      }

      // remove trailing slashes from the url
      const cleanedPath = path.replace(/\/+$/, "");
      const routeObj = {
        method: formattedMethod,
        path: cleanedPath,
        callbackFunc
      }

      const isRouteExists = this.routeList.some(route => route.method === formattedMethod && route.path === cleanedPath)

      if (isRouteExists) return this;
      this.routeList.push(routeObj);
      return this;
    }
  }


  handler(req, res, next) {
    try {
      let params = {};
      let isMatched = false;
      let matchedRoute = null;

      const { url, method, headers } = req || {};
      const base = `http://${headers?.host}`
      const parsedUrl = new URL(url, base);
      const { pathname, searchParams } = parsedUrl || {};

      const dynamicRoute = pathname.split('/').filter(Boolean);

      // check the static routes with the dynamic routes

      for (const route of this.routeList) {

        const staticRoute = route.path.split('/').filter(Boolean);

        if (route.method !== method) continue;
        if (staticRoute.length !== dynamicRoute.length) continue;

        let allSegmentsMatch = true;
        let tempParams = {}


        for (let i = 0; i < staticRoute.length; i++) {

          if (staticRoute[i].startsWith(':')) {
            const key = staticRoute[i].slice(1).trim();
            if (key && dynamicRoute[i]) {
              tempParams[key] = dynamicRoute[i];
            }
          }
          else if (staticRoute[i] !== dynamicRoute[i]) {
            allSegmentsMatch = false;
            break;
          }

        }

        if (allSegmentsMatch) {
          isMatched = true;
          matchedRoute = route;
          params = tempParams
        }
      }
      // include search params in params
      if (!isMatched) {
        return next(new AppError('This route does not exists.', 404))
      }

      req.query = {};
      // attach query params
      for (const [key, value] of searchParams.entries()) {
        req.query[key] = value;
      }

      // attach dynamic params
      req.params = params;

      // call the matched route
      matchedRoute?.callbackFunc(req, res, next);

    } catch (error) {
      console.log("Error executing router callback handler: ", error)
      return next(error);

    }

  }
}

