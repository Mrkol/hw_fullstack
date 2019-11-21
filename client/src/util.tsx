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
	<K, V> (map1: Map<K, V>) =>
		(map2: Map<K, V>) => new Map([...map2, ...map1])

export const optionMapMerge =
	<K, V>(map1: Map<K, V>) =>
		(map2: O.Option<Map<K, V>>) =>
			O.isNone(map2) ? map1 : new Map([...map2.value, ...map1])
