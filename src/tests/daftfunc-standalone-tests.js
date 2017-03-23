(function(){

  "use strict";
  
  //Useful:
  //http://stackoverflow.com/questions/4144686/jasmine-how-to-write-a-test-which-expects-an-error-to-be-thrown
  
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
  
    
  });
  
})();