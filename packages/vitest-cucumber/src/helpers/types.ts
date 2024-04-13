import type { MergeDeep as TypeFestMerge } from "type-fest";

export type Merge<TLeft, TRight> = TLeft extends Record<string, never>
	? TRight
	: TRight extends Record<string, never>
		? TLeft
		: TypeFestMerge<TLeft, TRight>;
