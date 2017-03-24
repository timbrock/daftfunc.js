let df = (function(){
  
  "use strict";
  
  const isArray = function(candidate){return Array.isArray(candidate);};
  const isArrayable = function(candidate){return !(candidate === undefined || candidate === null);};
  const newArray = function(arr){return isArrayable(arr) ? Array.from(arr) : [];};
  
  const isTruthy = function(val){return !!val;};
  
  const returnConstant = function(val){return function(){return val;};};
  const returnUndefined = returnConstant(undefined);
  
  const stringRep = function(entity){
    return Object.prototype.toString.call(entity);
  };
  
  const not = function(val){
    return !val;
  };
  
  const isFunction = function(candidate){
    return stringRep(candidate) === "[object Function]";
  };
  
  const isNumber = function(candidate){
    return stringRep(candidate) === "[object Number]" && !isNaN(candidate);
  };
  
  const validate = function(func, entity){
    return function(candidate){
      if(!func(candidate)){throw new TypeError(candidate + ' is not a ' + entity);}
      return candidate;
    };
  };
  
  const validateFunction = validate(isFunction, "function");
  const validateNumber = validate(isNumber, "number");
  
  const pipe = function(...funcs){
    if(!funcs.length){
       return returnUndefined;
    }
    funcs.forEach(validateFunction);
    return funcs.reduce(function(fn1, fn2){
      return function(...args){
        return fn2(fn1(...args));
      };
    });
  };
  
  const compose = function(...funcs){return pipe(...(funcs.reverse()));};
  
  const partial = function(func, ...args){
    return validateFunction(func).bind(null, ...args);
  };
  
  const restrictArity = function(n){
    validateNumber(n);
    if(n < 0){throw new RangeError(n + ' is too small');}
    return function(func){
      validateFunction(func);
      return function(..._args){
        let args = _args.slice(0, n);
        return func(...args);
      };
    };
  };
  
  const binary = restrictArity(2);
  
  
  const useMethod = function(arity, method, wrapper){
    return function(func, arr){
      const fn = wrapper ? arity(compose(wrapper, func)) : arity(validateFunction(func));
      return arr[method](fn);
    };  
  };
  
  
  const binaryMethod = partial(useMethod, binary);
  
  const transform = partial(binaryMethod, "map")();
  const keepIf = partial(binaryMethod, "filter")();
  const removeIf = partial(binaryMethod, "filter", not)();
  
  
  const createStore = function(arr, _save){
    
    let store = [];
    let save = true;
    
    Object.defineProperty(store, 'save', {
      get: function(){return save;},
      set: function(bool){save = isTruthy(bool);}
    });
    
    Object.defineProperty(store, 'last', {
      get: function(){return this.length - 1;}
    });
    
    Object.defineProperty(store, 'current', {
      get: function(){return this[this.last];},
      set: function(arr){this[save ? this.length : this.last] = arr;}
    });
    
    store.current = newArray(arr);
    store.save = _save;
    
    return store;
    
  };
  
  
  const dfOut = function(arr, save = true){

    const store = createStore(arr, save);
    
    const generate = function(task, fn, self){
      store.current = task(fn, store.current);
      return self;
    };
    
    const retrieve = (function(){
      const isValidIndex = function(n){return Number.isFinite(n) && n >= 0 && n < store.length;};
      return function(fn, n, i){
        return isValidIndex(n) ? fn(n, i) : undefined;
      };
    })();
    
    return Object.freeze({
      save: function(bool = true){store.save = bool; return this;},
      transform: function(fn){return generate(transform, fn, this);},
      keepIf: function(fn){return generate(keepIf, fn, this);},
      removeIf: function(fn){return generate(removeIf, fn, this);},
      $result: function(n = store.last){return retrieve(function(n){return newArray(store[n]);}, n);},
      $length: function(n = store.last){return retrieve(function(n){return store[n].length;}, n);},
      $idx: function(i, n = store.last){return retrieve(function(n){return store[n][i];}, n, i);},
      $nSaved: function(){return store.length;}
    });
    
  };
  
  const newArrayCall = function(func){
    return function(fn, arr){
      return func(fn, newArray(arr));
    };
  };
  
  dfOut.transform = newArrayCall(transform);
  dfOut.keepIf = newArrayCall(keepIf);
  dfOut.removeIf = newArrayCall(removeIf);
  
  dfOut.pipe = pipe;
  dfOut.compose = compose;
  dfOut.partial = partial;
  
  dfOut.restrictArity = restrictArity;
  dfOut.nullary = restrictArity(0);
  dfOut.unary = restrictArity(1);
  dfOut.binary = binary;
  dfOut.ternary = restrictArity(3);
  
  return dfOut;
  
})();