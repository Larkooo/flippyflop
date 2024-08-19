/* tslint:disable */
/* eslint-disable */
let wasm
export function __wbg_set_wasm(val) {
  wasm = val
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true })

cachedTextDecoder.decode()

let cachedUint8Memory0 = null

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8Memory0
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

const heap = new Array(128).fill(undefined)

heap.push(undefined, null, true, false)

let heap_next = heap.length

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  if (typeof heap_next !== 'number') throw new Error('corrupt heap')

  heap[idx] = obj
  return idx
}

function getObject(idx) {
  return heap[idx]
}

function _assertBoolean(n) {
  if (typeof n !== 'boolean') {
    throw new Error(`expected a boolean argument, found ${typeof n}`)
  }
}

function _assertNum(n) {
  if (typeof n !== 'number') throw new Error(`expected a number argument, found ${typeof n}`)
}

let WASM_VECTOR_LEN = 0

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder

let cachedTextEncoder = new lTextEncoder('utf-8')

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view)
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg)
        view.set(buf)
        return {
          read: arg.length,
          written: buf.length,
        }
      }

function passStringToWasm0(arg, malloc, realloc) {
  if (typeof arg !== 'string') throw new Error(`expected a string argument, found ${typeof arg}`)

  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length, 1) >>> 0
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len, 1) >>> 0

  const mem = getUint8Memory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len)
    const ret = encodeString(arg, view)
    if (ret.read !== arg.length) throw new Error('failed to pass whole string')
    offset += ret.written
    ptr = realloc(ptr, len, offset, 1) >>> 0
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

function isLikeNone(x) {
  return x === undefined || x === null
}

let cachedInt32Memory0 = null

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32Memory0
}

let cachedFloat64Memory0 = null

function getFloat64Memory0() {
  if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer)
  }
  return cachedFloat64Memory0
}

function dropObject(idx) {
  if (idx < 132) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

function debugString(val) {
  // primitive types
  const type = typeof val
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`
  }
  if (type == 'string') {
    return `"${val}"`
  }
  if (type == 'symbol') {
    const description = val.description
    if (description == null) {
      return 'Symbol'
    } else {
      return `Symbol(${description})`
    }
  }
  if (type == 'function') {
    const name = val.name
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`
    } else {
      return 'Function'
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length
    let debug = '['
    if (length > 0) {
      debug += debugString(val[0])
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i])
    }
    debug += ']'
    return debug
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val))
  let className
  if (builtInMatches.length > 1) {
    className = builtInMatches[1]
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val)
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')'
    } catch (_) {
      return 'Object'
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className
}

function _assertBigInt(n) {
  if (typeof n !== 'bigint') throw new Error(`expected a bigint argument, found ${typeof n}`)
}

let cachedBigInt64Memory0 = null

function getBigInt64Memory0() {
  if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
    cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer)
  }
  return cachedBigInt64Memory0
}

const CLOSURE_DTORS =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((state) => {
        wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
      })

function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor }
  const real = (...args) => {
    // First up with a closure we increment the internal reference
    // count. This ensures that the Rust closure environment won't
    // be deallocated while we're invoking it.
    state.cnt++
    const a = state.a
    state.a = 0
    try {
      return f(a, state.b, ...args)
    } finally {
      if (--state.cnt === 0) {
        wasm.__wbindgen_export_2.get(state.dtor)(a, state.b)
        CLOSURE_DTORS.unregister(state)
      } else {
        state.a = a
      }
    }
  }
  real.original = state
  CLOSURE_DTORS.register(real, state, state)
  return real
}

function logError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    let error = (function () {
      try {
        return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString()
      } catch (_) {
        return '<failed to stringify thrown value>'
      }
    })()
    console.error('wasm-bindgen: imported JS function that was not marked as `catch` threw an error:', error)
    throw e
  }
}
function __wbg_adapter_52(arg0, arg1, arg2) {
  _assertNum(arg0)
  _assertNum(arg1)
  wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcec875e529c5f2eb(
    arg0,
    arg1,
    addHeapObject(arg2),
  )
}

function __wbg_adapter_55(arg0, arg1, arg2) {
  _assertNum(arg0)
  _assertNum(arg1)
  wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h159887d0c305d4d5(
    arg0,
    arg1,
    addHeapObject(arg2),
  )
}

function __wbg_adapter_58(arg0, arg1, arg2) {
  _assertNum(arg0)
  _assertNum(arg1)
  wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hdb73e102a8977beb(
    arg0,
    arg1,
    addHeapObject(arg2),
  )
}

function __wbg_adapter_61(arg0, arg1) {
  _assertNum(arg0)
  _assertNum(arg1)
  wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h38983bc0328eaa82(
    arg0,
    arg1,
  )
}

function __wbg_adapter_64(arg0, arg1, arg2) {
  _assertNum(arg0)
  _assertNum(arg1)
  wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h43de745346981d0e(
    arg0,
    arg1,
    addHeapObject(arg2),
  )
}

/**
 * @param {string} typed_data
 * @param {string} address
 * @returns {string}
 */
export function typedDataEncode(typed_data, address) {
  let deferred4_0
  let deferred4_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(typed_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    wasm.typedDataEncode(retptr, ptr0, len0, ptr1, len1)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr3 = r0
    var len3 = r1
    if (r3) {
      ptr3 = 0
      len3 = 0
      throw takeObject(r2)
    }
    deferred4_0 = ptr3
    deferred4_1 = len3
    return getStringFromWasm0(ptr3, len3)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred4_0, deferred4_1, 1)
  }
}

/**
 * @returns {string}
 */
export function signingKeyNew() {
  let deferred1_0
  let deferred1_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.signingKeyNew(retptr)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    deferred1_0 = r0
    deferred1_1 = r1
    return getStringFromWasm0(r0, r1)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred1_0, deferred1_1, 1)
  }
}

/**
 * @param {string} private_key
 * @param {string} hash
 * @returns {Signature}
 */
export function signingKeySign(private_key, hash) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    wasm.signingKeySign(retptr, ptr0, len0, ptr1, len1)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    if (r2) {
      throw takeObject(r1)
    }
    return takeObject(r0)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

/**
 * @param {string} signing_key
 * @returns {string}
 */
export function verifyingKeyNew(signing_key) {
  let deferred3_0
  let deferred3_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(signing_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.verifyingKeyNew(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr2 = r0
    var len2 = r1
    if (r3) {
      ptr2 = 0
      len2 = 0
      throw takeObject(r2)
    }
    deferred3_0 = ptr2
    deferred3_1 = len2
    return getStringFromWasm0(ptr2, len2)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1)
  }
}

/**
 * @param {string} verifying_key
 * @param {string} hash
 * @param {Signature} signature
 * @returns {boolean}
 */
export function verifyingKeyVerify(verifying_key, hash, signature) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(verifying_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    wasm.verifyingKeyVerify(retptr, ptr0, len0, ptr1, len1, addHeapObject(signature))
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    if (r2) {
      throw takeObject(r1)
    }
    return r0 !== 0
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

/**
 * @param {string} rpc_url
 * @returns {Provider}
 */
export function createProvider(rpc_url) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.createProvider(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    if (r2) {
      throw takeObject(r1)
    }
    return Provider.__wrap(r0)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

let cachedUint32Memory0 = null

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer)
  }
  return cachedUint32Memory0
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0
  const mem = getUint32Memory0()
  for (let i = 0; i < array.length; i++) {
    mem[ptr / 4 + i] = addHeapObject(array[i])
  }
  WASM_VECTOR_LEN = array.length
  return ptr
}
/**
 * @param {string} class_hash
 * @param {string} salt
 * @param {(string)[]} constructor_calldata
 * @param {string} deployer_address
 * @returns {string}
 */
export function hashGetContractAddress(class_hash, salt, constructor_calldata, deployer_address) {
  let deferred6_0
  let deferred6_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(class_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(salt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    const ptr2 = passArrayJsValueToWasm0(constructor_calldata, wasm.__wbindgen_malloc)
    const len2 = WASM_VECTOR_LEN
    const ptr3 = passStringToWasm0(deployer_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len3 = WASM_VECTOR_LEN
    wasm.hashGetContractAddress(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr5 = r0
    var len5 = r1
    if (r3) {
      ptr5 = 0
      len5 = 0
      throw takeObject(r2)
    }
    deferred6_0 = ptr5
    deferred6_1 = len5
    return getStringFromWasm0(ptr5, len5)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred6_0, deferred6_1, 1)
  }
}

/**
 * @param {string} tag
 * @returns {string}
 */
export function getSelectorFromTag(tag) {
  let deferred2_0
  let deferred2_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.getSelectorFromTag(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    deferred2_0 = r0
    deferred2_1 = r1
    return getStringFromWasm0(r0, r1)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  const mem = getUint32Memory0()
  const slice = mem.subarray(ptr / 4, ptr / 4 + len)
  const result = []
  for (let i = 0; i < slice.length; i++) {
    result.push(takeObject(slice[i]))
  }
  return result
}
/**
 * @param {string} str
 * @returns {(string)[]}
 */
export function byteArraySerialize(str) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.byteArraySerialize(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    if (r3) {
      throw takeObject(r2)
    }
    var v2 = getArrayJsValueFromWasm0(r0, r1).slice()
    wasm.__wbindgen_free(r0, r1 * 4, 4)
    return v2
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

/**
 * @param {(string)[]} felts
 * @returns {string}
 */
export function byteArrayDeserialize(felts) {
  let deferred3_0
  let deferred3_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passArrayJsValueToWasm0(felts, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    wasm.byteArrayDeserialize(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr2 = r0
    var len2 = r1
    if (r3) {
      ptr2 = 0
      len2 = 0
      throw takeObject(r2)
    }
    deferred3_0 = ptr2
    deferred3_1 = len2
    return getStringFromWasm0(ptr2, len2)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1)
  }
}

/**
 * @param {(string)[]} inputs
 * @returns {string}
 */
export function poseidonHash(inputs) {
  let deferred3_0
  let deferred3_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passArrayJsValueToWasm0(inputs, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    wasm.poseidonHash(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr2 = r0
    var len2 = r1
    if (r3) {
      ptr2 = 0
      len2 = 0
      throw takeObject(r2)
    }
    deferred3_0 = ptr2
    deferred3_1 = len2
    return getStringFromWasm0(ptr2, len2)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1)
  }
}

/**
 * @param {string} name
 * @returns {string}
 */
export function getSelectorFromName(name) {
  let deferred3_0
  let deferred3_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.getSelectorFromName(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr2 = r0
    var len2 = r1
    if (r3) {
      ptr2 = 0
      len2 = 0
      throw takeObject(r2)
    }
    deferred3_0 = ptr2
    deferred3_1 = len2
    return getStringFromWasm0(ptr2, len2)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1)
  }
}

/**
 * @param {Uint8Array} inputs
 * @returns {string}
 */
export function starknetKeccak(inputs) {
  let deferred2_0
  let deferred2_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.starknetKeccak(retptr, addHeapObject(inputs))
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr1 = r0
    var len1 = r1
    if (r3) {
      ptr1 = 0
      len1 = 0
      throw takeObject(r2)
    }
    deferred2_0 = ptr1
    deferred2_1 = len1
    return getStringFromWasm0(ptr1, len1)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
export function cairoShortStringToFelt(str) {
  let deferred3_0
  let deferred3_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.cairoShortStringToFelt(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr2 = r0
    var len2 = r1
    if (r3) {
      ptr2 = 0
      len2 = 0
      throw takeObject(r2)
    }
    deferred3_0 = ptr2
    deferred3_1 = len2
    return getStringFromWasm0(ptr2, len2)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1)
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
export function parseCairoShortString(str) {
  let deferred3_0
  let deferred3_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.parseCairoShortString(retptr, ptr0, len0)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    var r3 = getInt32Memory0()[retptr / 4 + 3]
    var ptr2 = r0
    var len2 = r1
    if (r3) {
      ptr2 = 0
      len2 = 0
      throw takeObject(r2)
    }
    deferred3_0 = ptr2
    deferred3_1 = len2
    return getStringFromWasm0(ptr2, len2)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1)
  }
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`)
  }
  return instance.ptr
}
/**
 * Create the a client with the given configurations.
 * @param {ClientConfig} config
 * @returns {Promise<ToriiClient>}
 */
export function createClient(config) {
  const ret = wasm.createClient(addHeapObject(config))
  return takeObject(ret)
}

function handleError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e))
  }
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len)
}
function __wbg_adapter_325(arg0, arg1, arg2, arg3) {
  _assertNum(arg0)
  _assertNum(arg1)
  wasm.wasm_bindgen__convert__closures__invoke2_mut__h9ae1dc28fc963cfd(
    arg0,
    arg1,
    addHeapObject(arg2),
    addHeapObject(arg3),
  )
}

const AccountFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_account_free(ptr >>> 0))
/**
 */
export class Account {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0
    const obj = Object.create(Account.prototype)
    obj.__wbg_ptr = ptr
    AccountFinalization.register(obj, obj.__wbg_ptr, obj)
    return obj
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    AccountFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_account_free(ptr)
  }
  /**
   * @returns {string}
   */
  address() {
    let deferred2_0
    let deferred2_1
    try {
      if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      _assertNum(this.__wbg_ptr)
      wasm.account_address(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      var r3 = getInt32Memory0()[retptr / 4 + 3]
      var ptr1 = r0
      var len1 = r1
      if (r3) {
        ptr1 = 0
        len1 = 0
        throw takeObject(r2)
      }
      deferred2_0 = ptr1
      deferred2_1 = len1
      return getStringFromWasm0(ptr1, len1)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
    }
  }
  /**
   * @returns {string}
   */
  chainId() {
    let deferred2_0
    let deferred2_1
    try {
      if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      _assertNum(this.__wbg_ptr)
      wasm.account_chainId(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      var r3 = getInt32Memory0()[retptr / 4 + 3]
      var ptr1 = r0
      var len1 = r1
      if (r3) {
        ptr1 = 0
        len1 = 0
        throw takeObject(r2)
      }
      deferred2_0 = ptr1
      deferred2_1 = len1
      return getStringFromWasm0(ptr1, len1)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
    }
  }
  /**
   * @param {string} block_id
   */
  setBlockId(block_id) {
    try {
      if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      _assertNum(this.__wbg_ptr)
      const ptr0 = passStringToWasm0(block_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
      const len0 = WASM_VECTOR_LEN
      wasm.account_setBlockId(retptr, this.__wbg_ptr, ptr0, len0)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      if (r1) {
        throw takeObject(r0)
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @param {(Call)[]} calldata
   * @returns {Promise<string>}
   */
  executeRaw(calldata) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passArrayJsValueToWasm0(calldata, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.account_executeRaw(this.__wbg_ptr, ptr0, len0)
    return takeObject(ret)
  }
  /**
   * @param {string} private_key
   * @returns {Promise<Account>}
   */
  deployBurner(private_key) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.account_deployBurner(this.__wbg_ptr, ptr0, len0)
    return takeObject(ret)
  }
  /**
   * @returns {Promise<string>}
   */
  nonce() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.account_nonce(this.__wbg_ptr)
    return takeObject(ret)
  }
}

const IntoUnderlyingByteSourceFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0))
/**
 */
export class IntoUnderlyingByteSource {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    IntoUnderlyingByteSourceFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_intounderlyingbytesource_free(ptr)
  }
  /**
   * @returns {string}
   */
  get type() {
    let deferred1_0
    let deferred1_1
    try {
      if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      _assertNum(this.__wbg_ptr)
      wasm.intounderlyingbytesource_type(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      deferred1_0 = r0
      deferred1_1 = r1
      return getStringFromWasm0(r0, r1)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1)
    }
  }
  /**
   * @returns {number}
   */
  get autoAllocateChunkSize() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @param {any} controller
   */
  start(controller) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    wasm.intounderlyingbytesource_start(this.__wbg_ptr, addHeapObject(controller))
  }
  /**
   * @param {any} controller
   * @returns {Promise<any>}
   */
  pull(controller) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, addHeapObject(controller))
    return takeObject(ret)
  }
  /**
   */
  cancel() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    const ptr = this.__destroy_into_raw()
    _assertNum(ptr)
    wasm.intounderlyingbytesource_cancel(ptr)
  }
}

const IntoUnderlyingSinkFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_intounderlyingsink_free(ptr >>> 0))
/**
 */
export class IntoUnderlyingSink {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    IntoUnderlyingSinkFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_intounderlyingsink_free(ptr)
  }
  /**
   * @param {any} chunk
   * @returns {Promise<any>}
   */
  write(chunk) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, addHeapObject(chunk))
    return takeObject(ret)
  }
  /**
   * @returns {Promise<any>}
   */
  close() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    const ptr = this.__destroy_into_raw()
    _assertNum(ptr)
    const ret = wasm.intounderlyingsink_close(ptr)
    return takeObject(ret)
  }
  /**
   * @param {any} reason
   * @returns {Promise<any>}
   */
  abort(reason) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    const ptr = this.__destroy_into_raw()
    _assertNum(ptr)
    const ret = wasm.intounderlyingsink_abort(ptr, addHeapObject(reason))
    return takeObject(ret)
  }
}

const IntoUnderlyingSourceFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_intounderlyingsource_free(ptr >>> 0))
/**
 */
export class IntoUnderlyingSource {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    IntoUnderlyingSourceFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_intounderlyingsource_free(ptr)
  }
  /**
   * @param {any} controller
   * @returns {Promise<any>}
   */
  pull(controller) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, addHeapObject(controller))
    return takeObject(ret)
  }
  /**
   */
  cancel() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    const ptr = this.__destroy_into_raw()
    _assertNum(ptr)
    wasm.intounderlyingsource_cancel(ptr)
  }
}

const PipeOptionsFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_pipeoptions_free(ptr >>> 0))
/**
 * Raw options for [`pipeTo()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeTo).
 */
export class PipeOptions {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    PipeOptionsFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_pipeoptions_free(ptr)
  }
  /**
   * @returns {boolean}
   */
  get preventClose() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.pipeoptions_preventClose(this.__wbg_ptr)
    return ret !== 0
  }
  /**
   * @returns {boolean}
   */
  get preventCancel() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.pipeoptions_preventCancel(this.__wbg_ptr)
    return ret !== 0
  }
  /**
   * @returns {boolean}
   */
  get preventAbort() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.pipeoptions_preventAbort(this.__wbg_ptr)
    return ret !== 0
  }
  /**
   * @returns {AbortSignal | undefined}
   */
  get signal() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.pipeoptions_signal(this.__wbg_ptr)
    return takeObject(ret)
  }
}

const ProviderFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_provider_free(ptr >>> 0))
/**
 */
export class Provider {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0
    const obj = Object.create(Provider.prototype)
    obj.__wbg_ptr = ptr
    ProviderFinalization.register(obj, obj.__wbg_ptr, obj)
    return obj
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    ProviderFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_provider_free(ptr)
  }
  /**
   * @param {string} private_key
   * @param {string} address
   * @returns {Promise<Account>}
   */
  createAccount(private_key, address) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    const ret = wasm.provider_createAccount(this.__wbg_ptr, ptr0, len0, ptr1, len1)
    return takeObject(ret)
  }
  /**
   * @param {Call} call
   * @param {BlockId} block_id
   * @returns {Promise<Array<any>>}
   */
  call(call, block_id) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.provider_call(this.__wbg_ptr, addHeapObject(call), addHeapObject(block_id))
    return takeObject(ret)
  }
  /**
   * @param {string} txn_hash
   * @returns {Promise<boolean>}
   */
  waitForTransaction(txn_hash) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passStringToWasm0(txn_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.provider_waitForTransaction(this.__wbg_ptr, ptr0, len0)
    return takeObject(ret)
  }
}

const QueuingStrategyFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_queuingstrategy_free(ptr >>> 0))
/**
 */
export class QueuingStrategy {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    QueuingStrategyFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_queuingstrategy_free(ptr)
  }
  /**
   * @returns {number}
   */
  get highWaterMark() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.queuingstrategy_highWaterMark(this.__wbg_ptr)
    return ret
  }
}

const ReadableStreamGetReaderOptionsFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_readablestreamgetreaderoptions_free(ptr >>> 0))
/**
 * Raw options for [`getReader()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/getReader).
 */
export class ReadableStreamGetReaderOptions {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    ReadableStreamGetReaderOptionsFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_readablestreamgetreaderoptions_free(ptr)
  }
  /**
   * @returns {any}
   */
  get mode() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.readablestreamgetreaderoptions_mode(this.__wbg_ptr)
    return takeObject(ret)
  }
}

const SubscriptionFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_subscription_free(ptr >>> 0))
/**
 */
export class Subscription {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0
    const obj = Object.create(Subscription.prototype)
    obj.__wbg_ptr = ptr
    SubscriptionFinalization.register(obj, obj.__wbg_ptr, obj)
    return obj
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    SubscriptionFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_subscription_free(ptr)
  }
  /**
   * @returns {bigint}
   */
  get id() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.__wbg_get_subscription_id(this.__wbg_ptr)
    return BigInt.asUintN(64, ret)
  }
  /**
   * @param {bigint} arg0
   */
  set id(arg0) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    _assertBigInt(arg0)
    wasm.__wbg_set_subscription_id(this.__wbg_ptr, arg0)
  }
  /**
   */
  cancel() {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    const ptr = this.__destroy_into_raw()
    _assertNum(ptr)
    wasm.subscription_cancel(ptr)
  }
}

const ToriiClientFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_toriiclient_free(ptr >>> 0))
/**
 */
export class ToriiClient {
  constructor() {
    throw new Error('cannot invoke `new` directly')
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0
    const obj = Object.create(ToriiClient.prototype)
    obj.__wbg_ptr = ptr
    ToriiClientFinalization.register(obj, obj.__wbg_ptr, obj)
    return obj
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    ToriiClientFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_toriiclient_free(ptr)
  }
  /**
   * @param {Query} query
   * @returns {Promise<Entities>}
   */
  getEntities(query) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.toriiclient_getEntities(this.__wbg_ptr, addHeapObject(query))
    return takeObject(ret)
  }
  /**
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Entities>}
   */
  getAllEntities(limit, offset) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    _assertNum(limit)
    _assertNum(offset)
    const ret = wasm.toriiclient_getAllEntities(this.__wbg_ptr, limit, offset)
    return takeObject(ret)
  }
  /**
   * @param {Query} query
   * @returns {Promise<Entities>}
   */
  getEventMessages(query) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ret = wasm.toriiclient_getEventMessages(this.__wbg_ptr, addHeapObject(query))
    return takeObject(ret)
  }
  /**
   * @param {(EntityKeysClause)[]} clauses
   * @param {Function} callback
   * @returns {Promise<Subscription>}
   */
  onEntityUpdated(clauses, callback) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passArrayJsValueToWasm0(clauses, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.toriiclient_onEntityUpdated(this.__wbg_ptr, ptr0, len0, addHeapObject(callback))
    return takeObject(ret)
  }
  /**
   * @param {Subscription} subscription
   * @param {(EntityKeysClause)[]} clauses
   * @returns {Promise<void>}
   */
  updateEntitySubscription(subscription, clauses) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    _assertClass(subscription, Subscription)
    if (subscription.__wbg_ptr === 0) {
      throw new Error('Attempt to use a moved value')
    }
    const ptr0 = passArrayJsValueToWasm0(clauses, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.toriiclient_updateEntitySubscription(this.__wbg_ptr, subscription.__wbg_ptr, ptr0, len0)
    return takeObject(ret)
  }
  /**
   * @param {(EntityKeysClause)[]} clauses
   * @param {Function} callback
   * @returns {Promise<Subscription>}
   */
  onEventMessageUpdated(clauses, callback) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passArrayJsValueToWasm0(clauses, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.toriiclient_onEventMessageUpdated(this.__wbg_ptr, ptr0, len0, addHeapObject(callback))
    return takeObject(ret)
  }
  /**
   * @param {Subscription} subscription
   * @param {(EntityKeysClause)[]} clauses
   * @returns {Promise<void>}
   */
  updateEventMessageSubscription(subscription, clauses) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    _assertClass(subscription, Subscription)
    if (subscription.__wbg_ptr === 0) {
      throw new Error('Attempt to use a moved value')
    }
    const ptr0 = passArrayJsValueToWasm0(clauses, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.toriiclient_updateEventMessageSubscription(this.__wbg_ptr, subscription.__wbg_ptr, ptr0, len0)
    return takeObject(ret)
  }
  /**
   * @param {string} message
   * @param {(string)[]} signature
   * @returns {Promise<Uint8Array>}
   */
  publishMessage(message, signature) {
    if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value')
    _assertNum(this.__wbg_ptr)
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArrayJsValueToWasm0(signature, wasm.__wbindgen_malloc)
    const len1 = WASM_VECTOR_LEN
    const ret = wasm.toriiclient_publishMessage(this.__wbg_ptr, ptr0, len0, ptr1, len1)
    return takeObject(ret)
  }
}

export function __wbindgen_error_new(arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1))
  return addHeapObject(ret)
}

export function __wbindgen_is_undefined(arg0) {
  const ret = getObject(arg0) === undefined
  _assertBoolean(ret)
  return ret
}

export function __wbindgen_as_number(arg0) {
  const ret = +getObject(arg0)
  return ret
}

export function __wbindgen_in(arg0, arg1) {
  const ret = getObject(arg0) in getObject(arg1)
  _assertBoolean(ret)
  return ret
}

export function __wbindgen_boolean_get(arg0) {
  const v = getObject(arg0)
  const ret = typeof v === 'boolean' ? (v ? 1 : 0) : 2
  _assertNum(ret)
  return ret
}

export function __wbindgen_number_new(arg0) {
  const ret = arg0
  return addHeapObject(ret)
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1)
  return addHeapObject(ret)
}

export function __wbindgen_string_get(arg0, arg1) {
  const obj = getObject(arg1)
  const ret = typeof obj === 'string' ? obj : undefined
  var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len1 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len1
  getInt32Memory0()[arg0 / 4 + 0] = ptr1
}

export function __wbindgen_is_bigint(arg0) {
  const ret = typeof getObject(arg0) === 'bigint'
  _assertBoolean(ret)
  return ret
}

export function __wbindgen_is_object(arg0) {
  const val = getObject(arg0)
  const ret = typeof val === 'object' && val !== null
  _assertBoolean(ret)
  return ret
}

export function __wbindgen_is_string(arg0) {
  const ret = typeof getObject(arg0) === 'string'
  _assertBoolean(ret)
  return ret
}

export function __wbindgen_object_clone_ref(arg0) {
  const ret = getObject(arg0)
  return addHeapObject(ret)
}

export function __wbindgen_jsval_eq(arg0, arg1) {
  const ret = getObject(arg0) === getObject(arg1)
  _assertBoolean(ret)
  return ret
}

export function __wbindgen_bigint_from_i64(arg0) {
  const ret = arg0
  return addHeapObject(ret)
}

export function __wbindgen_bigint_from_u64(arg0) {
  const ret = BigInt.asUintN(64, arg0)
  return addHeapObject(ret)
}

export function __wbg_toriiclient_new() {
  return logError(function (arg0) {
    const ret = ToriiClient.__wrap(arg0)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_account_new() {
  return logError(function (arg0) {
    const ret = Account.__wrap(arg0)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_subscription_new() {
  return logError(function (arg0) {
    const ret = Subscription.__wrap(arg0)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_number_get(arg0, arg1) {
  const obj = getObject(arg1)
  const ret = typeof obj === 'number' ? obj : undefined
  if (!isLikeNone(ret)) {
    _assertNum(ret)
  }
  getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret)
}

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
  const ret = getObject(arg0) == getObject(arg1)
  _assertBoolean(ret)
  return ret
}

export function __wbg_String_b9412f8799faab3e() {
  return logError(function (arg0, arg1) {
    const ret = String(getObject(arg1))
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }, arguments)
}

export function __wbg_getwithrefkey_edc2c8960f0f1191() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)]
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_set_f975102236d3c502() {
  return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2)
  }, arguments)
}

export function __wbindgen_cb_drop(arg0) {
  const obj = takeObject(arg0).original
  if (obj.cnt-- == 1) {
    obj.a = 0
    return true
  }
  const ret = false
  _assertBoolean(ret)
  return ret
}

export function __wbg_setTimeout_75cb9b6991a4031d() {
  return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_clearTimeout_76877dbc010e786d() {
  return logError(function (arg0) {
    const ret = clearTimeout(takeObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_fetch_24472c79bb4342d1() {
  return logError(function (arg0, arg1) {
    const ret = fetch(getObject(arg0), getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_getReader_8ecba87d8003e950() {
  return handleError(function (arg0) {
    const ret = getObject(arg0).getReader()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_close_e9110ca16e2567db() {
  return logError(function (arg0) {
    getObject(arg0).close()
  }, arguments)
}

export function __wbg_enqueue_d71a1a518e21f5c3() {
  return logError(function (arg0, arg1) {
    getObject(arg0).enqueue(getObject(arg1))
  }, arguments)
}

export function __wbg_byobRequest_08c18cee35def1f4() {
  return logError(function (arg0) {
    const ret = getObject(arg0).byobRequest
    return isLikeNone(ret) ? 0 : addHeapObject(ret)
  }, arguments)
}

export function __wbg_close_da7e6fb9d9851e5a() {
  return logError(function (arg0) {
    getObject(arg0).close()
  }, arguments)
}

export function __wbg_view_231340b0dd8a2484() {
  return logError(function (arg0) {
    const ret = getObject(arg0).view
    return isLikeNone(ret) ? 0 : addHeapObject(ret)
  }, arguments)
}

export function __wbg_respond_8fadc5f5c9d95422() {
  return logError(function (arg0, arg1) {
    getObject(arg0).respond(arg1 >>> 0)
  }, arguments)
}

export function __wbg_buffer_4e79326814bdd393() {
  return logError(function (arg0) {
    const ret = getObject(arg0).buffer
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_byteOffset_b69b0a07afccce19() {
  return logError(function (arg0) {
    const ret = getObject(arg0).byteOffset
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_byteLength_5299848ed3264181() {
  return logError(function (arg0) {
    const ret = getObject(arg0).byteLength
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_cancel_7f202496da02cd45() {
  return logError(function (arg0) {
    const ret = getObject(arg0).cancel()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_releaseLock_9ae075576f54bf0b() {
  return handleError(function (arg0) {
    getObject(arg0).releaseLock()
  }, arguments)
}

export function __wbg_read_88c96573fc8b3b01() {
  return logError(function (arg0) {
    const ret = getObject(arg0).read()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_done_76252d32deca186b() {
  return logError(function (arg0) {
    const ret = getObject(arg0).done
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_value_ff3741eb46856618() {
  return logError(function (arg0) {
    const ret = getObject(arg0).value
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_fetch_bc7c8e27076a5c84() {
  return logError(function (arg0) {
    const ret = fetch(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_is_function(arg0) {
  const ret = typeof getObject(arg0) === 'function'
  _assertBoolean(ret)
  return ret
}

export function __wbg_queueMicrotask_481971b0d87f3dd4() {
  return logError(function (arg0) {
    queueMicrotask(getObject(arg0))
  }, arguments)
}

export function __wbg_queueMicrotask_3cbae2ec6b6cd3d6() {
  return logError(function (arg0) {
    const ret = getObject(arg0).queueMicrotask
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_instanceof_Window_f401953a2cf86220() {
  return logError(function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof Window
    } catch (_) {
      result = false
    }
    const ret = result
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_document_5100775d18896c16() {
  return logError(function (arg0) {
    const ret = getObject(arg0).document
    return isLikeNone(ret) ? 0 : addHeapObject(ret)
  }, arguments)
}

export function __wbg_navigator_6c8fa55c5cc8796e() {
  return logError(function (arg0) {
    const ret = getObject(arg0).navigator
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_location_1325817a58c77ceb() {
  return logError(function (arg0) {
    const ret = getObject(arg0).location
    return isLikeNone(ret) ? 0 : addHeapObject(ret)
  }, arguments)
}

export function __wbg_fetch_921fad6ef9e883dd() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0).fetch(getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_fetch_bc400efeda8ac0c8() {
  return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).fetch(getObject(arg1), getObject(arg2))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_userAgent_e94c7cbcdac01fea() {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).userAgent
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }, arguments)
}

export function __wbg_signal_a61f78a3478fd9bc() {
  return logError(function (arg0) {
    const ret = getObject(arg0).signal
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_new_0d76b0581eca6298() {
  return handleError(function () {
    const ret = new AbortController()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_abort_2aa7521d5690750e() {
  return logError(function (arg0) {
    getObject(arg0).abort()
  }, arguments)
}

export function __wbg_new_ab6fd82b10560829() {
  return handleError(function () {
    const ret = new Headers()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_append_7bfcb4937d1d5e29() {
  return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4))
  }, arguments)
}

export function __wbg_hostname_3d9f22c60dc5bec6() {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).hostname
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }, arguments)
}

export function __wbg_data_3ce7c145ca4fbcdc() {
  return logError(function (arg0) {
    const ret = getObject(arg0).data
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_newwithstrandinit_3fd6fba4083ff2d0() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_instanceof_Response_849eb93e75734b6e() {
  return logError(function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof Response
    } catch (_) {
      result = false
    }
    const ret = result
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_url_5f6dc4009ac5f99d() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg1).url
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }, arguments)
}

export function __wbg_status_61a01141acd3cf74() {
  return logError(function (arg0) {
    const ret = getObject(arg0).status
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_headers_9620bfada380764a() {
  return logError(function (arg0) {
    const ret = getObject(arg0).headers
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_body_9545a94f397829db() {
  return logError(function (arg0) {
    const ret = getObject(arg0).body
    return isLikeNone(ret) ? 0 : addHeapObject(ret)
  }, arguments)
}

export function __wbg_text_450a059667fd91fd() {
  return handleError(function (arg0) {
    const ret = getObject(arg0).text()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_channel_034b1aa3ed21a9d2() {
  return logError(function (arg0) {
    const ret = getObject(arg0).channel
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_localDescription_fdbb277fe69d4acc() {
  return logError(function (arg0) {
    const ret = getObject(arg0).localDescription
    return isLikeNone(ret) ? 0 : addHeapObject(ret)
  }, arguments)
}

export function __wbg_setondatachannel_613916740487b8be() {
  return logError(function (arg0, arg1) {
    getObject(arg0).ondatachannel = getObject(arg1)
  }, arguments)
}

export function __wbg_newwithconfiguration_b15024f88c684163() {
  return handleError(function (arg0) {
    const ret = new RTCPeerConnection(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_close_afa09a1e1e0a4628() {
  return logError(function (arg0) {
    getObject(arg0).close()
  }, arguments)
}

export function __wbg_createDataChannel_df256842e04b7684() {
  return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).createDataChannel(getStringFromWasm0(arg1, arg2))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_createDataChannel_2cb2147b68f44846() {
  return logError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).createDataChannel(getStringFromWasm0(arg1, arg2), getObject(arg3))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_createOffer_663eb8b8f3c6f8b9() {
  return logError(function (arg0) {
    const ret = getObject(arg0).createOffer()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_generateCertificate_31ec6e1adc163ef8() {
  return handleError(function (arg0) {
    const ret = RTCPeerConnection.generateCertificate(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_setLocalDescription_41e208bc9dc2a799() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0).setLocalDescription(getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_setRemoteDescription_38ba80261ed6604d() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0).setRemoteDescription(getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_sdp_ec4467d15d4acf46() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg1).sdp
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }, arguments)
}

export function __wbg_now_4e659b3d15f470d9() {
  return logError(function (arg0) {
    const ret = getObject(arg0).now()
    return ret
  }, arguments)
}

export function __wbg_readyState_4cec7804e10e9e8c() {
  return logError(function (arg0) {
    const ret = getObject(arg0).readyState
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_bufferedAmount_d96d201d2e665ac8() {
  return logError(function (arg0) {
    const ret = getObject(arg0).bufferedAmount
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_setbufferedAmountLowThreshold_c720cc0a1e84254f() {
  return logError(function (arg0, arg1) {
    getObject(arg0).bufferedAmountLowThreshold = arg1 >>> 0
  }, arguments)
}

export function __wbg_setonopen_a8d36a7a7e2a0661() {
  return logError(function (arg0, arg1) {
    getObject(arg0).onopen = getObject(arg1)
  }, arguments)
}

export function __wbg_setonclose_756793f4dc0ff009() {
  return logError(function (arg0, arg1) {
    getObject(arg0).onclose = getObject(arg1)
  }, arguments)
}

export function __wbg_setonmessage_156079b6ed74472e() {
  return logError(function (arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1)
  }, arguments)
}

export function __wbg_setonbufferedamountlow_b8982bab0245abc8() {
  return logError(function (arg0, arg1) {
    getObject(arg0).onbufferedamountlow = getObject(arg1)
  }, arguments)
}

export function __wbg_setbinaryType_0b2b32db03dea0c0() {
  return logError(function (arg0, arg1) {
    getObject(arg0).binaryType = takeObject(arg1)
  }, arguments)
}

export function __wbg_send_a10ff3ed6e9aee30() {
  return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2))
  }, arguments)
}

export function __wbg_crypto_1d1f22824a6a080c() {
  return logError(function (arg0) {
    const ret = getObject(arg0).crypto
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_msCrypto_eb05e62b530a1508() {
  return logError(function (arg0) {
    const ret = getObject(arg0).msCrypto
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_getRandomValues_3aa56aa6edec874c() {
  return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1))
  }, arguments)
}

export function __wbg_randomFillSync_5c9c955aa56b6049() {
  return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1))
  }, arguments)
}

export function __wbg_require_cca90b1a94a0255b() {
  return handleError(function () {
    const ret = module.require
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_process_4a72847cc503995b() {
  return logError(function (arg0) {
    const ret = getObject(arg0).process
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_versions_f686565e586dd935() {
  return logError(function (arg0) {
    const ret = getObject(arg0).versions
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_node_104a2ff8d6ea03a2() {
  return logError(function (arg0) {
    const ret = getObject(arg0).node
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_new_16b304a2cfa7ff4a() {
  return logError(function () {
    const ret = new Array()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_get_bd8e338fbd5f5cc8() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0]
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_set_d4638f722068f043() {
  return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2)
  }, arguments)
}

export function __wbg_isArray_2ab64d95e09ea0ae() {
  return logError(function (arg0) {
    const ret = Array.isArray(getObject(arg0))
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_length_cd7af8117672b8b8() {
  return logError(function (arg0) {
    const ret = getObject(arg0).length
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_push_a5b05aedc7234f9f() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1))
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_instanceof_ArrayBuffer_836825be07d4c9d2() {
  return logError(function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof ArrayBuffer
    } catch (_) {
      result = false
    }
    const ret = result
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_instanceof_Error_e20bb56fd5591a93() {
  return logError(function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof Error
    } catch (_) {
      result = false
    }
    const ret = result
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_new_28c511d9baebfa89() {
  return logError(function (arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_toString_ffe4c9ea3b3532e9() {
  return logError(function (arg0) {
    const ret = getObject(arg0).toString()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_newnoargs_e258087cd0daa0ea() {
  return logError(function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_call_27c0f87801dedf93() {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_call_b3ca7c6051f9bec1() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_call_8e7cb608789c2528() {
  return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_new_d9bc3a0147634640() {
  return logError(function () {
    const ret = new Map()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_set_8417257aaedc936b() {
  return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_next_196c84450b364254() {
  return handleError(function (arg0) {
    const ret = getObject(arg0).next()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_next_40fc327bfc8770e6() {
  return logError(function (arg0) {
    const ret = getObject(arg0).next
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_done_298b57d23c0fc80c() {
  return logError(function (arg0) {
    const ret = getObject(arg0).done
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_value_d93c65011f51a456() {
  return logError(function (arg0) {
    const ret = getObject(arg0).value
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_isSafeInteger_f7b04ef02296c4d2() {
  return logError(function (arg0) {
    const ret = Number.isSafeInteger(getObject(arg0))
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_now_3014639a94423537() {
  return logError(function () {
    const ret = Date.now()
    return ret
  }, arguments)
}

export function __wbg_entries_95cc2c823b285a09() {
  return logError(function (arg0) {
    const ret = Object.entries(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_new_72fb9a18b5ae2624() {
  return logError(function () {
    const ret = new Object()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_toString_c816a20ab859d0c1() {
  return logError(function (arg0) {
    const ret = getObject(arg0).toString()
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_iterator_2cee6dadfd956dfa() {
  return logError(function () {
    const ret = Symbol.iterator
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_new_81740750da40724f() {
  return logError(function (arg0, arg1) {
    try {
      var state0 = { a: arg0, b: arg1 }
      var cb0 = (arg0, arg1) => {
        const a = state0.a
        state0.a = 0
        try {
          return __wbg_adapter_325(a, state0.b, arg0, arg1)
        } finally {
          state0.a = a
        }
      }
      const ret = new Promise(cb0)
      return addHeapObject(ret)
    } finally {
      state0.a = state0.b = 0
    }
  }, arguments)
}

export function __wbg_resolve_b0083a7967828ec8() {
  return logError(function (arg0) {
    const ret = Promise.resolve(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_catch_0260e338d10f79ae() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0).catch(getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_then_0c86a60e8fcfe9f6() {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_then_a73caa9a87991566() {
  return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_globalThis_d1e6af4856ba331b() {
  return handleError(function () {
    const ret = globalThis.globalThis
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_self_ce0dbfc45cf2f5be() {
  return handleError(function () {
    const ret = self.self
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_window_c6fb939a7f436783() {
  return handleError(function () {
    const ret = window.window
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_global_207b558942527489() {
  return handleError(function () {
    const ret = global.global
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_instanceof_Uint8Array_2b3bbecd033d19f6() {
  return logError(function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof Uint8Array
    } catch (_) {
      result = false
    }
    const ret = result
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_new_63b92bc8671ed464() {
  return logError(function (arg0) {
    const ret = new Uint8Array(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_newwithlength_e9b4878cebadb3d3() {
  return logError(function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb() {
  return logError(function (arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_subarray_a1f73cd4b5b42fe1() {
  return logError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_length_c20a40f15020d68a() {
  return logError(function (arg0) {
    const ret = getObject(arg0).length
    _assertNum(ret)
    return ret
  }, arguments)
}

export function __wbg_set_a47bac70306a19a7() {
  return logError(function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0)
  }, arguments)
}

export function __wbg_stringify_8887fe74e1c50d81() {
  return handleError(function (arg0) {
    const ret = JSON.stringify(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_get_e3c254076557e348() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1))
    return addHeapObject(ret)
  }, arguments)
}

export function __wbg_has_0af94d20077affa2() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.has(getObject(arg0), getObject(arg1))
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_set_1f9b04f170055d33() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2))
    _assertBoolean(ret)
    return ret
  }, arguments)
}

export function __wbg_buffer_12d079cc21e14bdb() {
  return logError(function (arg0) {
    const ret = getObject(arg0).buffer
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_debug_string(arg0, arg1) {
  const ret = debugString(getObject(arg1))
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  const len1 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len1
  getInt32Memory0()[arg0 / 4 + 0] = ptr1
}

export function __wbindgen_bigint_get_as_i64(arg0, arg1) {
  const v = getObject(arg1)
  const ret = typeof v === 'bigint' ? v : undefined
  if (!isLikeNone(ret)) {
    _assertBigInt(ret)
  }
  getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret)
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0)
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}

export function __wbindgen_rethrow(arg0) {
  throw takeObject(arg0)
}

export function __wbindgen_memory() {
  const ret = wasm.memory
  return addHeapObject(ret)
}

export function __wbindgen_closure_wrapper14504() {
  return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 780, __wbg_adapter_52)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_closure_wrapper14506() {
  return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 782, __wbg_adapter_55)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_closure_wrapper14508() {
  return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 778, __wbg_adapter_58)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_closure_wrapper24961() {
  return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1601, __wbg_adapter_61)
    return addHeapObject(ret)
  }, arguments)
}

export function __wbindgen_closure_wrapper36002() {
  return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2207, __wbg_adapter_64)
    return addHeapObject(ret)
  }, arguments)
}
