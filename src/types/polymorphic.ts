import type { ComponentPropsWithRef, ElementType, ForwardRefExoticComponent } from 'react';

/**
 * Distributive Omit - preserves union types during omit operation
 */
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;

/**
 * Merge two types, with TOverride's properties taking precedence
 */
type Merge<TBase, TOverride> = Omit<TBase, keyof TOverride> & TOverride;

/**
 * Distributive merge - preserves union types during merge
 */
type DistributiveMerge<TBase, TOverride> = DistributiveOmit<TBase, keyof TOverride> & TOverride;

/**
 * Props for a polymorphic component with `as` prop
 */
export type PolymorphicProps<
  TComponent extends ElementType,
  TOwnProps extends object,
> = DistributiveMerge<ComponentPropsWithRef<TComponent>, TOwnProps & { as?: TComponent }>;

/**
 * Polymorphic component type with forwardRef support
 */
export type PolymorphicComponent<
  TDefault extends ElementType,
  TOwnProps extends object = object,
> = ForwardRefExoticComponent<
  Merge<ComponentPropsWithRef<TDefault>, TOwnProps & { as?: TDefault }>
> &
  (<TComponent extends ElementType = TDefault>(
    props: PolymorphicProps<TComponent, TOwnProps>
  ) => React.ReactElement | null);
