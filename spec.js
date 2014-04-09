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

    describe('after step 3', function(){
        function Bean(){}
        function Grinder(){}
        function Water(){}

        it('can create a service that has service dependencies', function(){
            var di = new Di();
            var counter = 0;
            di.set('bean', function(){
                counter ++;
                return new Bean();
            });
            di.set('grinder', function(){return new Grinder();});
            di.set('water', function(){return new Water();});
            di.set('mike', function(){return 'mike';});

            var b, g, w, m;

            function makeCoffee(bean, grinder, water, mike) {
                b = bean;
                g = grinder;
                w = water;
                m = mike;
            }
            makeCoffee.inject = ['bean', 'grinder', 'water', 'mike'];


            di.set('coffee', makeCoffee);
            di.get('coffee');

            expect(counter).toBe(1);
            expect(b instanceof Bean).toBe(true);
            expect(g instanceof Grinder).toBe(true);
            expect(w instanceof Water).toBe(true);
            expect(m).toBe('mike');
        });

        it('can create a service that has constant dependencies', function(){
            var di = new Di();

            di.constant('captain_age', 42);
            function answer(age) {
                return age;
            };

            answer.inject = ['captain_age'];
            di.set('the_answer', answer);

            expect(di.get('the_answer')).toBe(42);
        });

        it('can work out simple dependencies', function(){
            var di = new Di();

            di.set('captain_age', function(){return 42;});
            function answer(age) {
                return age;
            };

            answer.inject = ['captain_age'];
            di.set('the_answer', answer);

            expect(di.get('the_answer')).toBe(42);
        });

        it('deals with multi-level dependencies', function(){
            var di = new Di();

            function realCaptainAge() {return 42;}
            di.set('real_captain_age', realCaptainAge);

            function captainAge(realAge) {return realAge;}
            captainAge.inject = ['real_captain_age'];
            di.set('captain_age', captainAge);

            function howOld(age) {return age;}
            howOld.inject = ['captain_age'];
            di.set('how_old', howOld);

            expect(di.get('how_old')).toBe(42);
        });
    });

    describe('after step 4', function(){
        it('should warn the user in a case of circular dependencies', function(){
            var di = new Di();

            function A(b){}
            function B(a){}

            A.inject = ['b']
            B.inject = ['a']

            di.set('a', A);
            di.set('b', B);

            expect(function(){
                di.get('a');
            }).toThrow(new Error('Circular dependencies.'));
        });

        it('should still allow multiple services to depend on the same one', function(){
            var di = new Di();

            function A(b){}
            function B(a){}
            function C(a){}

            A.inject = ['b', 'c']
            B.inject = ['c']

            di.set('a', A);
            di.set('b', B);
            di.set('c', C);

            expect(function(){
                di.get('a');
            }).not.toThrow(new Error('Circular dependencies.'));
        });
    });

    describe('after step 5', function(){
        it('can share a service', function(){
            var di = new Di();

            function A(b, c){return {b_knows: b, c_knows: c};}
            function B(c){ return ['I am B', c[0]];}
            function C(){ return ['I am C'];}

            A.inject = ['b', 'c']
            B.inject = ['c']

            di.share('a', A);
            di.share('b', B);
            di.share('c', C);

            var a = di.get('a');
            expect(di.get('a')).toBe(a);
            expect(di.get('a')).toBe(a);
            expect(di.get('a')).toBe(a);
        });
    });
});