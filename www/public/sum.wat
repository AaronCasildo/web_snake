(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (func $sum (type 0) (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  (export "sum" (func $sum)))
