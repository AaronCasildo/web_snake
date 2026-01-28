;; (module
;;   (type (;0;) (func (param i32 i32) (result i32)))
;;   (func $sum (type 0) (param $a i32) (param $b i32) (result i32)
;;     local.get $a
;;     local.get $b
;;     i32.add)
;;   (export "sum" (func $sum)))

(module
    (import "console" "log" (func $mylog))
    (import "console" "error" (func $error))

    (func $sum (param $a i32)(param $b i32) (result i32)
        call $mylog
        call $error
        local.get $a
        local.get $b
        i32.add
    )
  (export "sum" (func $sum))
)