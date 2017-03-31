let df = (function(){
  
  "use strict";
  
  const isArray = function(candidate){return Array.isArray(candidate);};
  const isArrayable = function(candidate){return !(candidate === undefined || candidate === null);};
  const newArray = function(arr){return isArrayable(arr) ? Array.from(arr) : [];};
  
  const isTruthy = function(val){return !!val;};
  const returnConstant = function(val){return function(){return val;};};
  const returnUndefined = returnConstant(undefined);
  const returnNaN = returnConstant(NaN);
  const stringRep = function(entity){return Object.prototype.toString.call(entity);};
  const not = function(val){return !val;};
  
  const isFunction = function(candidate){
    return stringRep(candidate) === "[object Function]";
  };
  
  const isNumber = function(candidate){
    return stringRep(candidate) === "[object Number]" && !isNaN(candidate);
  };
  
  const hasProperty = function(entity, property){
    try{
      return property in entity ? true : false;
    } catch(err){
      return false;
    }
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
  const ternary = restrictArity(3);
  
  
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
  
  const quickRemove = function(nRemove, arr){
    validateNumber(parseInt(nRemove, 10));
    let complete = false;
    if(nRemove >= arr.length){
      complete = [];
    } else if(nRemove <= 0){
      complete = newArray(arr);
    }
    return complete;
  };
  
  const removeFirst = function(nRemove, arr){
    return quickRemove(nRemove, arr) || arr.slice(nRemove);
  };
  
  const removeLast = function(nRemove, arr){
    return quickRemove(nRemove, arr) || arr.slice(0, arr.length - nRemove);
  };
  
  const prepend = function(_array, arr){
    let array = newArray(_array);
    return array.concat(arr);
  };
  
  const append = function(_array, arr){
    let array = newArray(_array);
    return arr.concat(array);
  };
  
  const mergeWith = function(func, _array, arr){
    let array = newArray(_array);
    let n = (arr.length > array.length) ? arr.length : arr.length;
    let outArray = Array(n).fill(undefined);
    for(let i=0; i<n; i++){
      outArray[i] = func(arr[i], array[i], i);
    }
    return outArray;
  };
  
  const reverse = function(arr){
    return newArray(arr).reverse();
  };
  
  const sort = function(func, arr){
    validateFunction(func);
    return newArray(arr).sort(func);
  };
  
  
  //http://stackoverflow.com/a/12646864
  const shuffler = function(nextRandom = Math.random){
    return function(arr){
      let array = newArray(arr);
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(nextRandom() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };
  };
  
  const shuffle = shuffler();
  
  const unique = function(arr){
    return newArray(new Set(arr));
  };
  
  const rotate = function(nRotate, arr){
    validateNumber(nRotate);
    let len = arr.length;
    let n = Math.floor(Math.abs(nRotate))%len || 0; //+-Infinity -> no change
    let out = newArray(arr);
    if(n !== 0){
      let temp;
      if(nRotate < 0){
        temp = out.splice(0, n);
      } else{
        temp = out.splice(0, len-n);
      }
      out.push(...temp);
    } 
    return out;
  };
  
  const simpleMaths = function(func){
    return function(num){
      if(!isNumber(parseFloat(num))){return returnNaN;}
      return function(val){
        return func(val, parseFloat(num));
      };
    };
  };
  
  const add = simpleMaths(function(a, b){return a+b;});
  const increment = add(1);
  const subtract = simpleMaths(function(a, b){return a-b;});
  const subtractFrom = simpleMaths(function(a, b){return b-a;});
  const decrement = subtract(1);
  const multiplyBy = simpleMaths(function(a, b){return a*b;});
  const raiseToPower = simpleMaths(function(a, b){return Math.pow(a, b);});
  const exponentiate = simpleMaths(function(a, b){return Math.pow(b, a);});
  const divide = simpleMaths(function(a, b){return b/a;});
  const divideBy = simpleMaths(function(a, b){return a/b;});
  const modulo = simpleMaths(function(a, b){return a%b;});
  const reciprocate = divide(1);
  
  
  const simpleComparison = function(func){
    return function(storedVal){
      return function(val){
        return func(val, storedVal);
      };
    };
  };  
  
  
  const equal = simpleComparison(function(a, b){return a === b;});
  const notEqual = simpleComparison(function(a, b){return a !== b;});
  const greaterThan = simpleComparison(function(a, b){return a > b;});
  const greaterOrEqual = simpleComparison(function(a, b){return a >= b;});
  const lessThan = simpleComparison(function(a, b){return a < b;});
  const lessOrEqual = simpleComparison(function(a, b){return a <= b;});
  
  
  const pluck = function(prop){
    return function(obj){
      return hasProperty(obj, prop) ? obj[prop] : undefined;
    };
  };
  
  const elementLength = function(element){
    let out;
    if(isArrayable(element)){
      out = element.length !== undefined ? element.length : element.size;
    }
    return out;
  };
  
  const modify = function(func, arr){
    validateFunction(func);
    return newArray(func(newArray(arr)));
  };
  
  
  const createStore = function(arr, _save, _debug){
    
    let store = [];
    let save = true;
    let debug = false;
    
    Object.defineProperty(store, 'save', {
      get: function(){return save;},
      set: function(bool){save = isTruthy(bool);}
    });
    
    Object.defineProperty(store, 'debug', {
      get: function(){return debug;},
      set: function(bool){debug = isTruthy(bool);}
    });
    
    Object.defineProperty(store, 'last', {
      get: function(){return this.length - 1;}
    });
    
    Object.defineProperty(store, 'current', {
      get: function(){return this[this.last];},
      set: function(arr){
        if(this.debug){console.log(arr);}
        this[save ? this.length : this.last] = arr;
      }
    });
    
    store.current = newArray(arr);
    store.save = _save;
    store.debug = _debug;
    
    return store;
    
  };
  
  
  const dfOut = function(arr, save = true, debug = false){

    const store = createStore(arr, save, debug);
    
    const generate = function(self, task, ...args){
      store.current = task(...args, store.current);
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
      debug: function(bool = true){store.debug = bool; return this;},
      transform: function(fn){return generate(this, transform, fn);},
      keepIf: function(fn){return generate(this, keepIf, fn);},
      removeIf: function(fn){return generate(this, removeIf, fn);},
      removeFirst: function(nRemove = 1){return generate(this, removeFirst, nRemove);},
      removeLast: function(nRemove = 1){return generate(this, removeLast, nRemove);},
      prepend: function(array){return generate(this, prepend, array);},
      append: function(array){return generate(this, append, array);},
      mergeWith: function(array, fn){return generate(this, mergeWith, fn, array);},
      replaceWith: function(arr){return generate(this, function(){return newArray(arr);});},
      reverse: function(fn){return generate(this, reverse);},
      sort: function(fn){return generate(this, sort, fn);},
      shuffle: function(){return generate(this, shuffle);},
      rotate: function(nRotate){return generate(this, rotate, nRotate);},
      unique: function(){return generate(this, unique);},
      add: function(adder){return generate(this, transform, add(adder));},
      increment: function(){return generate(this, transform, increment);},
      subtract: function(subtractor){return generate(this, transform, subtract(subtractor));},
      subtractFrom: function(subtractor){return generate(this, transform, subtractFrom(subtractor));},
      decrement: function(){return generate(this, transform, decrement);},
      multiplyBy: function(multiplier){return generate(this, transform, multiplyBy(multiplier));},
      raiseToPower: function(power){return generate(this, transform, raiseToPower(power));},
      exponentiate: function(base){return generate(this, transform, exponentiate(base));},
      divide: function(dividend){return generate(this, transform, divide(dividend));},
      divideBy: function(divisor){return generate(this, transform, divideBy(divisor));},
      modulo: function(divisor){return generate(this, transform, modulo(divisor));},
      reciprocate: function(){return generate(this, transform, reciprocate);},
      equal: function(comparator){return generate(this, transform, equal(comparator));},
      notEqual: function(comparator){return generate(this, transform, notEqual(comparator));},
      lessThan: function(comparator){return generate(this, transform, lessThan(comparator));},
      lessOrEqual: function(comparator){return generate(this, transform, lessOrEqual(comparator));},
      greaterThan: function(comparator){return generate(this, transform, greaterThan(comparator));},
      greaterOrEqual: function(comparator){return generate(this, transform, greaterOrEqual(comparator));},
      pluck: function(prop){return generate(this, transform, pluck(prop));},
      modify: function(fn){return generate(this, modify, fn);},
      clear: function(){return generate(this, returnConstant([]));},
      $result: function(n = store.last){return retrieve(function(n){return newArray(store[n]);}, n);},
      $length: function(n = store.last){return retrieve(function(n){return store[n].length;}, n);},
      $idx: function(i, n = store.last){return retrieve(function(n){return store[n][i];}, n, i);},
      $elementLengths: function(n = store.last){return retrieve(function(n){return transform(elementLength, store[n]);}, n);},
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
  dfOut.ternary = ternary;
  
  dfOut.sort = sort;
  dfOut.sorts = {};
  dfOut.sorts.numeric = function(a, b){return parseFloat(a) - parseFloat(b);};
  dfOut.sorts.lexical = function(a, b){return (a === b) ? (0) : (a.toString() > b.toString());};
  
  dfOut.shuffler = shuffler;
  
  return dfOut;
  
})();