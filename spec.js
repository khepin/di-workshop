describe('di', function(){
    it('can be instantiated', function(){
        expect(new Di()).toBeDefined();
    });

    describe('after step 1', function(){
        it('returns `undefined` if a service is not defined', function(){
            var di = new Di();

            expect(di.get('mlqksdf')).toBe(undefined);
        });

        it('can set and retrieve a constant', function(){
            var di = new Di();

            di.constant('a', 23);

            expect(di.get('a')).toBe(23);
        });

        it('can use anything as a constant', function(){
            var di = new Di();

            // A string
            di.constant('string', 'a');
            // An int
            di.constant('int', 123);
            // A float
            di.constant('float', 1.23);
            // An array
            var arr = [1,2,3];
            di.constant('array', arr);
            // An object
            var obj = {id: 123};
            di.constant('object', obj);
            // A function
            var f = function(){
                return 123;
            };
            di.constant('function', f);

            expect(di.get('string')).toBe('a');
            expect(di.get('int')).toBe(123);
            expect(di.get('float')).toBe(1.23);
            expect(di.get('array')).toBe(arr);
            expect(di.get('object')).toBe(obj);
            expect(di.get('function')).toBe(f);
        });
    });
});