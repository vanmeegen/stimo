"use strict";

/**
 * Simple Typed Immutable Objects
 * @author Marco van Meegen
 *
 * inspired by doop https://smellegantcode.wordpress.com/2016/03/07/doop-immutable-classes-for-typescript/
 *
 */

/**
 * decorate class to enable constructor modifying inplace
 * @param constructor
 * @return modified constructor setting the __stimo__Constructing flag while executing original constructor
 */
export function stimo(constructor: Function): any {
    const wrappedConstructor = function (...args: any[]) {
        // During construction, set the flag so stimo setters can mutate
        this.__stimo__Constructing = (this.__stimo__Constructing || 0) + 1;
        try {
            constructor.apply(this, args);
        } finally {
            this.__stimo__Constructing--;
            if (this.__stimo__Constructing === 0) {
                delete this.__stimo__Constructing;
            }
        }
        return this;
    };
    const prototype = wrappedConstructor.prototype = constructor.prototype;
    const propNameMap = prototype.__stimo__PropNameToIndexMap = clone(prototype.__stimo__PropNameToIndexMap);
    if (propNameMap) {
        // inherits from other stimo class
        for (const key of Object.keys(propNameMap)) {
            let setterKey = "set" + key.substring(0, 1).toUpperCase();
            if (key.length > 1) {
                setterKey = setterKey + key.substring(1);
            }
            if (prototype[setterKey]) {
                // update all setters to clone correct derived type
                Object.defineProperty(prototype, setterKey, {
                    writable: true,
                    enumerable: true,
                    configurable: true,
                    value: make_setter(prototype, propNameMap[key])
                });
            }
        }
    }
    return wrappedConstructor;
}

/**
 * decorate get accessor for property
 * @param target target object
 * @param propertyKey key of property
 * @param descriptor descriptor
 * @return {TypedPropertyDescriptor<any>} which implements the getter using an indexed array
 */
export function stimo_get(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    descriptor.get = make_getter(lookupOrCreateIndex(target, propertyKey));
    return descriptor;
}

export function stimo_set(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    // convert 'setX' to 'x'
    let prop = propertyKey.substring(3, 4).toLowerCase();
    if (propertyKey.length > 3) {
        prop = prop + propertyKey.substring(4);
    }
    descriptor.value = make_setter(target, lookupOrCreateIndex(target, prop));
    return descriptor;
}

/**
 * decorate withMutations method to batch updates into one copy
 * @param target target object
 * @param propertyKey key of property
 * @param descriptor descriptor
 * @return {TypedPropertyDescriptor<any>} which implements the getter using an indexed array
 */
export function stimo_mut(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    descriptor.value = make_mutator(target);
    return descriptor;
}

function make_mutator(target: any) {
    return function stimo_withMutations(mutator: (any) => any): any {
        // make copy, set it in in-place mutation mode and apply mutator
        // otherwise create clone
        let result;
        const clonedObject = Object.create(this);
        // copy values array from the original object
        clonedObject.__stimo__PropertyValues = this.__stimo__PropertyValues.slice(0);
        try {
            clonedObject.__stimo__Constructing = (clonedObject.__stimo__Constructing || 0) + 1;
            // and mutate clone in-place
            result = mutator(clonedObject);
        } finally {
            // reset in-place mutation mode
            clonedObject.__stimo__Constructing--;
            if (clonedObject.__stimo__Constructing === 0) {
                delete clonedObject.__stimo__Constructing;
            }
        }
        return result;
    }
}

/**
 * maintains PropNameToIndexMap
 * @param target
 * @param propertyKey
 * @return index into Values array for property with given key
 */
function lookupOrCreateIndex(target: any, propertyKey: string) {
    // if not yet existing, create map of property names to indices into values array
    let indices;
    if (target.hasOwnProperty("__stimo__PropNameToIndexMap")) {
        indices = target.__stimo__PropNameToIndexMap;
    } else {
        indices = target.__stimo__PropNameToIndexMap = clone(target.__stimo__PropNameToIndexMap) || {};
    }
    let index = target.__stimo__PropNameToIndexMap[propertyKey];
    if (typeof index == 'undefined') {
        //console.log("Index for propertyKey '" + propertyKey + "' at target '" + target.constructor.name + "' not found, creating one.");
        // update index
        index = target.__stimo__MaxIndex || 0;
        target.__stimo__MaxIndex = index + 1;
        indices[propertyKey] = index;
        //console.log("Index created: " + index);
    }
    return index;
}

function make_getter(index: number) {
    return function stimo_get() {
        // get from values array
        return this.__stimo__PropertyValues && this.__stimo__PropertyValues[index];
    };
}

function make_setter(target: any, index: number) {
    return function stimo_set(val: any) {
        // first make sure values array exists
        if (!this.__stimo__PropertyValues) {
            this.__stimo__PropertyValues = [];
        }

        // if in constructor just change value and return this
        if (this.__stimo__Constructing) {
            this.__stimo__PropertyValues[index] = val;
            return this;
        }

        if (this.__stimo__PropertyValues[index] !== val) {
            // otherwise create clone
            const clonedObject = Object.create(target);
            // copy values array from the original object
            clonedObject.__stimo__PropertyValues = this.__stimo__PropertyValues.slice(0);
            // and mutate property value
            clonedObject.__stimo__PropertyValues[index] = val;
            return clonedObject;
        } else {
            return this;
        }

    };
}

function clone(obj: any) {
    return obj && JSON.parse(JSON.stringify(obj));
}

