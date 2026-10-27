export type Left<E> = {
  readonly _tag: 'Left';
  readonly left: E;
};

export type Right<A> = {
  readonly _tag: 'Right';
  readonly right: A;
};

export type Either<E, A> = Left<E> | Right<A>;

export const left = <E, A = never>(value: E): Either<E, A> => ({
  _tag: 'Left',
  left: value,
});

export const right = <A, E = never>(value: A): Either<E, A> => ({
  _tag: 'Right',
  right: value,
});

export const isLeft = <E, A>(value: Either<E, A>): value is Left<E> => value._tag === 'Left';

export const getOrThrow = <E, A>(value: Either<E, A>): A => {
  if (isLeft(value)) throw value.left;
  return value.right;
};
