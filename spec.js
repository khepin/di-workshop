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

    describe('after step 2', function(){
        it('can set and retrieve services', function(){
            var di = new Di();

            di.set('a', function(){
                return 'a';
            });

            expect(di.get('a')).toBe('a');
        });

        it('lazily instantiates services', function(){
            var di = new Di();
            var counter = 0;

            di.set('s', function(){
                counter++;
                return 's';
            });

            expect(counter).toBe(0);
            expect(di.get('s')).toBe('s');
            expect(counter).toBe(1);
        });

        it('instantiates a new service each time', function(){
            var di = new Di();

            function Dog() {};

            di.set('dog', function(){
                return new Dog();
            });

            var rufus = di.get('dog');

            expect(di.get('dog')).not.toBe(rufus);
        });
    });
});