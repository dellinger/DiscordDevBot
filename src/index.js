console.log("Hello World");

class Test extends TestParent{

    constructor(someField) {
      super();
      this.someField = someField;
    }

    doSomething = (withSomeData) => {
        console.log(`Doing something with ${withSomeData}`);
    };


}
