import { Optional } from 'monocle-ts'
import * as O from 'fp-ts/lib/Option'

export function mapL<K, V>(key: K): Optional<Map<K, V>, V> {
	return new Optional<Map<K, V>, V>(
		map => O.fromNullable(map.get(key)),
		value => map => {
			let newMap = new Map(map)
			newMap.set(key, value)
			return newMap
		}
	)
}

export const mapMerge =
	<K, V>(map1: Map<K, V>) =>
		(map2: Map<K, V>) => new Map([...map2, ...map1])

export const optionMapMerge =
	<K, V>(map1: Map<K, V>) =>
		(map2: O.Option<Map<K, V>>) =>
			O.isNone(map2) ? map1 : new Map([...map2.value, ...map1])

export const optionSetMerge =
	<V,>(set1: Set<V>) =>
		(set2: O.Option<Set<V>>) =>
			O.isNone(set2) ? set1 : new Set([...set2.value, ...set1])
