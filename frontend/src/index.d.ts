/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */

declare module 'lodash.clonedeep' {
  export default function cloneDeep<V, A = V, O = object, S = object>(
    value: V,
    isDeep?: boolean,
    custimizer?: (value: V) => A,
    key?: string,
    object?: O,
    stack?: S
  ): V | A;
}
