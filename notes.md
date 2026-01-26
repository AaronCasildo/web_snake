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