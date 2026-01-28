# Notes from this project

## Format-Hex usage

Displays the contents of a file (or data) as hexadecimal values alongside their ASCII character representations, useful for inspecting binary files, debugging file formats, or viewing non-printable characters.

---

## wasm2wat

wasm2wat - Converts WebAssembly binary files (.wasm) to WebAssembly Text format (.wat), making the compiled bytecode human-readable for debugging, learning, or manual editing.

**Usage to convert a .wasm file to .wat**
```
wasm2wat sum.wasm -o sum.wat
```

**Usage to convert a .wat file to .wasm**
```
wasm2wat sum.wat -o sum.wasm
```

---

## Setting Up Node.js Development Server with Webpack

Creates a development environment with hot-reloading for web applications, useful for rapid development and testing.

**Initial setup commands:**

1. Initialize npm project (if not already done):
```bash
npm init -y
```

2. Install webpack and webpack-dev-server:
```bash
npm install --save webpack webpack-cli
npm install --save-dev webpack-dev-server
```

3. Create `webpack.config.js` in your project directory:
```javascript
const path = require('path');
module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "index.js"
    },
    mode: "development"
}
```

4. Add dev script to `package.json`:
```json
"scripts": {
    "dev": "webpack-dev-server"
}
```

5. Run the development server:
```bash
npm run dev
```

The server will start and watch for file changes, automatically reloading the browser when code is updated.

6. Installs the copy-webpack-plugin package, which copies static files to your build output directory during webpack builds.
```bash 
npm install --save copy-webpack-plugin
```

## Refresh the PATH environment on VSpowershell:
```
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```