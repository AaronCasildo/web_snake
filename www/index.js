async function init(){
            const response = await fetch("sum.wasm");
            const buffer = await response.arrayBuffer();
            // debugger
            const wasm = await WebAssembly.instantiate(buffer);

            const sumFunction = wasm.instance.exports.sum;
            const result = sumFunction(9, 9);
            console.log("Result of sum(9, 9):", result);
        }

        init();