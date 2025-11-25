

export class App {



  // stores all incoming middlewares
  constructor() {
    this.middlewareList = [];
  }

  use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Middleware must be a function');
    }
    this.middlewareList.push(fn);
    return this;
  }

  handler(req, res) {
    let index = 0;

    const next = (err) => {

      // pointer for current middleware
      const fn = this.middlewareList[index++];
      // if there's no middleware, stop
      if (!fn) return;

      console.log("Executing middleware", index, fn.name || "anonymous");


      if (err) {

        // if function is an error middleware
        console.log("Error Middleware");
        if (fn.length === 4) {
          console.log("Call Error Function")
          return fn(err, req, res, next);
        }
        console.log("Call next error function")
        return next(err);

      }

      // is it is normal function

      console.log("Normal Function")
      if (fn.length < 4) {
        console.log("Call Normal Function");
        return fn(req, res, next)
      }
      console.log("Call next function")
      return next()
    }
    
    next();

  }


}