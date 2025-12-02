document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

let txt1; // global variables
let txt2;
let btn;
let lblRes;


function calculate() {
    let num1 = parseFloat(txt1.value);
    let num2 = parseFloat(txt2.value);

    let res = num1 + num2;

    lblRes.innerText = res;
}

function pageLoaded() {

    txt1 = document.getElementById('txt1');
    txt2 = document.querySelector('#txt2');
    btn = document.getElementById('btnCalc');
    lblRes = document.getElementById('lblRes');

    btn.addEventListener("click", () => {
        calculate();
    });
}



let btn2 = document.getElementById("btn2"); // saved globaly

btn2.addEventListener("click", () => {
    print("Button2 clicked: " + btn2.id + " | " + btn2.innerText);

});

// thae same in another way 
//btn2.addEventListener("click", func1());
//function func1() { ...... }



// =============================================
// HELPER: PRINT TO TEXTAREA
// =============================================
function print(msg) {

    // Get textarea element refernce and set its value
    const ta = document.getElementById("output");
    // if its found (not null), set its value, else log to console
    if (ta) ta.value = msg;
    else console.log(msg);
}


// =============================================
// STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// =============================================
function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", "); // like lambda

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) { return fn(a, b); }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;


    print(out);
}
