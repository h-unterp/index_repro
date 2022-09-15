***Lightweight testing setup for fauna***

**Instructions:**

1. Supply admin key of an already existing DB in .env as FAUNA_SECRET
2. npm install
3. tsc
4. node lib/function.js

**Why?**
Because it was not clear to me how [faunadb-js](https://github.com/fauna/faunadb-js) handles non-supported 
features of javascript or typescript:

in [src/funcdef.ts](./src/funcdef.ts) 
```ts
Let({ thing1: arg as Thing }, 
    Var("thing1")
);
```
Gets transpiled into a `UDF` as 
```ts
Query(Lambda("ref", Let({ thing1: Var("ref") }, Var("thing1"))))
```

I wish it failed more explicitly during compilation. 

That said, if you want to take advantage of features of ts/js in a `UDF` then you would
need to implement them before calling `query` eg:

```js
client
  .query(Call(Function("let_test"), "hey" as Thing))
  .then((response) => console.log(response));
```

This would fail, but it is just to demonstrate where it should be used.