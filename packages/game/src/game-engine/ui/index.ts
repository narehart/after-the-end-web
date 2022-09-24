import { Component, Entity } from "../ecs";

export type UIComponentElementProps<T extends Component = Component> = Partial<{
  [K in keyof InstanceType<T>]: InstanceType<T>[K];
}>;

export type UIComponentElement<T extends Component = Component> = {
  type: T;
  params: ConstructorParameters<T>;
  updates?: UIComponentElementProps<T>;
};

export type UIEntityElement<
  T extends UIComponentElement[] = UIComponentElement[]
> = {
  id?: Entity;
  components: T;
  children?: UIEntityElement[];
};

export function createComponent<T extends Component = Component>(
  config: UIComponentElement<T>
) {
  return config;
}

export function createEntity<
  T extends UIComponentElement[] = UIComponentElement[]
>(config: UIEntityElement<T>) {
  return config;
}
