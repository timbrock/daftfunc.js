(function(){

  "use strict";
  
  //Useful:
  //http://stackoverflow.com/questions/4144686/jasmine-how-to-write-a-test-which-expects-an-error-to-be-thrown
  
  const identity = x => x;
  const triple = x => x*3;
  const decrement = x => x - 1;
  const modulo8 = x => x%8;
  const sum = function(...vals){return vals.reduce(function(a, b){return a + b;});};
  const divide = function(...arr){return arr.reduce(function(a, b){return a/b;});};
  
  
  describe("Standalone functions", function(){
    
    
    describe("transform function", function(){

      let task = df.transform;
      let func, arr;

      beforeEach(function(){
        func = x => 2*x;
        arr = ([1, 2, 3]);
      });
      
      it("should throw error if no arguments passed", function(){
        expect(function(){task();}).toThrow();
      });
      
      it("should return empty array if no array argument passed", function(){
        expect(task(func, [])).toEqual([]);
      });

      it("should return empty array if empty array passed", function(){
        expect(task(func, [])).toEqual([]);
      });
      
      it("should throw if func argument not a function", function(){
        expect(function(){task(7, arr);}).toThrow();
      });
      
      it("should return copy of input if func does nothing.", function(){
        let result = task(x => x, arr);
        expect(result).toEqual(arr);
        expect(result).not.toBe(arr);
      });

      it("should return array of same length if func does something meaningful.", function(){
        let result = task(func, arr);
        expect(result.length).toEqual(arr.length);
        expect(result).toEqual([2, 4, 6]);
        result = task(x => [], arr);
        expect(result.length).toEqual(arr.length);
        expect(result).toEqual([[], [], []]);
      });

    });
    
    
    describe("keepIf function", function(){

      let task = df.keepIf;
      let func, arr;

      beforeEach(function(){
        func = x => x < 4;
        arr = ([2, 4, 6]);
      });
      
      it("should throw error if no arguments passed", function(){
        expect(function(){task();}).toThrow();
      });
      
      it("should return empty array if no array argument passed", function(){
        expect(task(func, [])).toEqual([]);
      });

      it("should return empty array if empty array passed", function(){
        expect(task(func, [])).toEqual([]);
      });
      
      it("should throw error if func argument not a function", function(){
        expect(function(){task(7, arr);}).toThrow();
      });
      
      it("should return copy of input if func does nothing.", function(){
        let result = task(x => true, arr);
        expect(result).toEqual(arr);
        expect(result).not.toBe(arr);
      });

      it("should return meaningful array if func does something meaningful.", function(){
        let result = task(func, arr);
        expect(result.length).not.toBeGreaterThan(arr.length);
        expect(result).toEqual([2]);
        result = task(x => [], arr);
        expect(result.length).toEqual(arr.length);
        expect(result).toEqual(arr);
      });
      
      it("should treat a set like the equivalen array.", function(){
        let result = task(func, new Set(arr));
        expect(result.length).not.toBeGreaterThan(arr.length);
        expect(result).toEqual([2]);
        result = task(x => [], new Set(arr));
        expect(result.length).toEqual(arr.length);
        expect(result).toEqual(arr);
      });

    });
    
    
    describe("removeIf function", function(){

      let task = df.removeIf;
      let func, arr;

      beforeEach(function(){
        func = x => x < 4;
        arr = ([2, 4, 6]);
      });
      
      it("should throw error if no arguments passed", function(){
        expect(function(){task();}).toThrow();
      });
      
      it("should return empty array if no array argument passed", function(){
        expect(task(func, [])).toEqual([]);
      });

      it("should return empty array if empty array passed", function(){
        expect(task(func, [])).toEqual([]);
      });
      
      it("should throw if func argument not a function", function(){
        expect(function(){task(7, arr);}).toThrow();
      });
      
      it("should return copy of input if func does nothing.", function(){
        let result = task(x => false, arr);
        expect(result).toEqual(arr);
        expect(result).not.toBe(arr);
      });

      it("should return meaningful array if func does something meaningful.", function(){
        let result = task(func, arr);
        expect(result.length).not.toBeGreaterThan(arr.length);
        expect(result).toEqual([4, 6]);
        result = task(x => [], arr);
        expect(result.length).toEqual(0);
        expect(result).toEqual([]);
      });
      
      it("should treat a set like the equivalent array.", function(){
        let result = task(func, new Set(arr));
        expect(result.length).not.toBeGreaterThan(arr.length);
        expect(result).toEqual([4, 6]);
        result = task(x => [], new Set(arr));
        expect(result.length).toEqual(0);
        expect(result).toEqual([]);
      });
      
      it("should treat a set like the equivalent array.", function(){
        let result = task(func, new Set(arr));
        expect(result.length).not.toBeGreaterThan(arr.length);
        expect(result).toEqual([4, 6]);
        result = task(x => [], new Set(arr));
        expect(result.length).toEqual(0);
        expect(result).toEqual([]);
      });

    });
    
    
    describe("pipe and compose functions", function(){

      let pipe = df.pipe;
      let compose = df.compose;
      let task = df.transform;
      let arr;

      beforeEach(function(){
        arr = ([12, 44, 68]);
      });
      
      it("to return function that return undefined if no arguments passed in", function(){
        let p = pipe();
        let c = compose();
        expect(task(p, arr)).toEqual([undefined, undefined, undefined]);
        expect(task(c, arr)).toEqual(task(p, arr));
      });
      
      it("should throw error if non-function passed in", function(){
        let nf = 7;
        let nfs = [identity, nf, modulo8]; 
        expect(function(){pipe(nf);}).toThrow();
        expect(function(){compose(nf);}).toThrow();
        expect(function(){pipe(nfs);}).toThrow();
        expect(function(){compose(nfs);}).toThrow();
        expect(function(){pipe(...nfs);}).toThrow();
        expect(function(){compose(...nfs);}).toThrow();
      });
      
      it("to treat single function argument as if it was just that function", function(){
        let fn, p, c;
        fn = identity;
        p = pipe(fn);
        c = compose(fn);
        expect(task(p, arr)).toEqual(task(fn, arr));
        expect(task(p, arr)).toEqual(arr);
        expect(task(p, arr)).not.toBe(arr);
        expect(task(c, arr)).toEqual(task(fn, arr));
        expect(task(c, arr)).toEqual(arr);
        expect(task(c, arr)).not.toBe(arr);
        fn = triple;
        p = pipe(fn);
        c = compose(fn);
        expect(task(p, arr)).toEqual(task(fn, arr));
        expect(task(c, arr)).toEqual(task(fn, arr));
        fn = triple;
        p = pipe(fn);
        c = compose(fn);
        expect(task(p, arr)).toEqual(task(fn, arr));
        expect(task(c, arr)).toEqual(task(fn, arr));
        fn = triple;
        p = pipe(fn);
        c = compose(fn);
        expect(task(p, arr)).toEqual(task(fn, arr));
        expect(task(c, arr)).toEqual(task(fn, arr));
      });
      
      it("to properly process two functions", function(){
        let fns, rfns,  p, c;
        fns = [triple, decrement];
        rfns = Array.from(fns).reverse();
        p = pipe(...fns);
        c = compose(...fns);
        expect(task(p, arr)).toEqual([35, 131, 203]);
        expect(task(c, arr)).toEqual([33, 129, 201]);
        c = compose(...rfns);
        expect(task(p, arr)).toEqual(task(c, arr));
      });
      
      it("to properly process three functions", function(){
        let fns, rfns,  p, c;
        fns = [triple, decrement, modulo8];
        rfns = Array.from(fns).reverse();
        p = pipe(...fns);
        c = compose(...fns);
        expect(task(p, arr)).toEqual([3, 3, 3]);
        expect(task(c, arr)).toEqual([9, 9, 9]);
        c = compose(...rfns);
        expect(task(p, arr)).toEqual(task(c, arr));
      });
         
    });
  
    
    describe("partial function", function(){
      
      let partial = df.partial;
      let psum, pdivide; 
      
      it("should throw error if no arguments passed in", function(){
        expect(function(){partial();}).toThrow();
      });
      
      it("should throw error if non-function passed in as first argument", function(){
        expect(function(){partial(7);}).toThrow();
      });
      
      it("should imitate passed function if only function is passed in", function(){
        psum = partial(sum);
        pdivide = partial(divide);
        expect(psum(1)).toEqual(sum(1));
        expect(psum(1, 2)).toEqual(sum(1, 2));
        expect(psum(1, 2, 3)).toEqual(sum(1, 2, 3));
        expect(pdivide(3)).toEqual(divide(3));
        expect(pdivide(3, 2)).toEqual(divide(3, 2));
        expect(pdivide(3, 2, 1)).toEqual(divide(3, 2, 1));
      });
      
      it("should effectively add left-most argument if passed 1 argument", function(){
        psum = partial(sum, 3);
        pdivide = partial(divide, 4);
        expect(psum(1)).toEqual(sum(1) + 3);
        expect(psum(1, 2)).toEqual(sum(1, 2) + 3);
        expect(psum(1, 2, 3)).toEqual(sum(1, 2, 3) + 3);
        expect(pdivide(3)).toEqual(divide(4, 3));
        expect(pdivide(3, 2)).toEqual(divide(4, 3, 2));
        expect(pdivide(3, 2, 1)).toEqual(divide(4, 3, 2, 1));
      });
      
      it("should effectively add multiple arguments to left if passed mutiple arguments", function(){
        pdivide = partial(divide, 4, 3);
        expect(pdivide(3)).toEqual(divide(4, 3, 3));
        expect(pdivide(3, 2)).toEqual(divide(4, 3, 3, 2));
        expect(pdivide(3, 2, 1)).toEqual(divide(4, 3, 3, 2, 1));
        pdivide = partial(divide, 3, 6);
        expect(pdivide(3)).toEqual(divide(3, 6, 3));
        expect(pdivide(3, 2)).toEqual(divide(3, 6, 3, 2));
        expect(pdivide(3, 2, 1)).toEqual(divide(3, 6, 3, 2, 1));
      });
      
    });
    
    
    describe("restrictArity function", function(){
      let restrictArity = df.restrictArity;
      
      it("should throw error if no arguments passed in", function(){
        expect(function(){restrictArity();}).toThrow();
      });
      
      it("should throw error if non-number passed in", function(){
        expect(function(){restrictArity([]);}).toThrow();
        expect(function(){restrictArity({});}).toThrow();
        expect(function(){restrictArity("");}).toThrow();
      });
      
      it("should throw error if negative number passed in", function(){
        expect(function(){restrictArity(-0.01);}).toThrow();
        expect(function(){restrictArity(-1);}).toThrow();
        expect(function(){restrictArity(-Infinity);}).toThrow();
      });
      
      it("should be fine if 0 is passed in", function(){
        expect(function(){restrictArity(0);}).not.toThrow();
      });
      
      it("should be fine if positive number (including Infinity) is passed in", function(){
        expect(function(){restrictArity(8);}).not.toThrow();
        expect(function(){restrictArity(Infinity);}).not.toThrow();
      });
      
    });
    
     
    describe("fixed-arity functions", function(){
      
      let ra = df.restrictArity;
      
      let nullary = df.nullary;
      let unary = df.unary;
      let binary = df.binary;
      let ternary = df.ternary;
      let quaternary = ra(4);
      let quinary = ra(5);
      let senary = ra(6);
      let septenary = ra(7);
      let octonary = ra(8);
      let nonary = ra(9);
      let denary = ra(10);
      let infinitary = ra(Infinity);
      
      let arr = [1, 2, 3, 4, 5, 6, 7];
      
      it("should throw error if no arguments passed in", function(){
        expect(function(){nullary();}).toThrow();
        expect(function(){unary();}).toThrow();
        expect(function(){binary();}).toThrow();
        expect(function(){ternary();}).toThrow();
        expect(function(){quarternary();}).toThrow();
        expect(function(){infinitary();}).toThrow();
      });
      
      it("should limit the number of arguments passed", function(){
        expect(sum(...arr)).toEqual(28);
        expect(function(){nullary(sum)(...arr);}).toThrow();
        expect(unary(sum)(...arr)).toEqual(1);
        expect(binary(sum)(...arr)).toEqual(3);
        expect(ternary(sum)(...arr)).toEqual(6);
        expect(quaternary(sum)(...arr)).toEqual(10);
        expect(quinary(sum)(...arr)).toEqual(15);
        expect(senary(sum)(...arr)).toEqual(21);
        expect(septenary(sum)(...arr)).toEqual(28);
        expect(octonary(sum)(...arr)).toEqual(28);
        expect(nonary(sum)(...arr)).toEqual(28);
        expect(denary(sum)(...arr)).toEqual(28);
        expect(infinitary(sum)(...arr)).toEqual(28);
      });
      
    });
    
    
    describe("sort function", function(){
      let sort = df.sort;
      let arr = [33, 121, 2];
      let arr2 = ["33", "121", "2"];
      let numericSort = df.sorts.numeric;
      let lexicalSort = df.sorts.lexical;
      
      it("should throw error if no arguments passed in", function(){
        expect(function(){sort();}).toThrow();
      });
      
      it("should throw error if non-function passed in as first argument", function(){
        expect(function(){sort([]);}).toThrow();
        expect(function(){sort({});}).toThrow();
        expect(function(){sort("");}).toThrow();
      });
      
      it("should return empty array if no array passed in", function(){
        expect(sort(numericSort)).toEqual([]);
        expect(sort(lexicalSort)).toEqual([]);
      });
      
      it("should return sorted array if appropriate function and array passed in.", function(){
        expect(sort(numericSort, arr)).toEqual([2, 33, 121]);
        expect(sort(lexicalSort, arr)).toEqual([121, 2, 33]);
        expect(sort(numericSort, arr2)).toEqual(["2", "33", "121"]);
        expect(sort(lexicalSort, arr2)).toEqual(["121", "2", "33"]);
      });
      
    });
    
    
    describe("shuffler function", function(){
      let shuffle = df.shuffler();
      let arr = [1, 233, 44, 67, 98, 79, "a", {}];
      
      it("should return empty array if no arguments passed in", function(){
        expect(shuffle()).toEqual([]);
      });
      
      
      it("should return shuffled array if array passed in", function(){
        expect(shuffle(arr).length).toEqual(arr.length);
      });
      
    });
    
    
  });
  
})();