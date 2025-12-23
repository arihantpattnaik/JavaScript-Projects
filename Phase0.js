// 01. VARIABLES & MUTABILITY

// const protects reference , not the content
const x = 10;
// x = 20 ❌

const user = { name: "Ben" };
user.name = "Arihant"; // ✅ allowed


// 02. TYPES(JS is Dynamic, but not Weak)
typeof 10        // "number"
typeof "hi"      // "string"
typeof true      // "boolean"
typeof {}        // "object"
typeof []        // "object" (JS quirk)

// Truthy / Falsy (remember this)
false, 0, "", null, undefined, NaN

// 03. Function 

const add=(a,b) => a+b;
const greet=() =>
console.log("Hello");
setTimeout(greet,1000);

// 0.4 Objects & Array
const user = {
    name: "Ben",
    age: 23
};
  
user.age += 1; // age becomes 24 as well

const nums = [1, 2, 3];
nums.map(n => n * 2);       // transform 2,4,6
nums.filter(n => n > 1);   // select 2,3
nums.reduce((a, b) => a+b, 0); // aggregate 1+2+3=6

// 0.5 DOM BASICS (Important)


  