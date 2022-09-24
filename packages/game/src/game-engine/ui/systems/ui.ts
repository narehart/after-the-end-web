import { LayerCompoent } from "../../ecs";
import { Component, Entity, System } from "../../ecs/ecs";

type UIComponentElementProps<T extends Component = Component> = Partial<{
  [K in keyof InstanceType<T>]: InstanceType<T>[K];
}>;

type UIComponentElement<T extends Component = Component> = {
  type: T;
  params: ConstructorParameters<T>;
  updates?: UIComponentElementProps<T>;
};

type UIEntityElement<T extends UIComponentElement[] = UIComponentElement[]> = {
  id?: Entity;
  components: T;
  children?: UIEntityElement[];
};

type RenderCallback = (renderer: {
  createComponent: typeof UIRootComponent.createComponent;
  createEntity: typeof UIRootComponent.createEntity;
}) => UIEntityElement;

export class UIRootComponent extends Component {
  public prevTree?: UIEntityElement;
  public tree?: UIEntityElement;

  constructor(public layer: number) {
    super();
  }

  static createComponent<T extends Component = Component>(
    config: UIComponentElement<T>
  ) {
    return config;
  }

  static createEntity<T extends UIComponentElement[] = UIComponentElement[]>(
    config: UIEntityElement<T>
  ) {
    return config;
  }

  render(cb: RenderCallback) {
    const { createComponent, createEntity } = UIRootComponent;
    this.prevTree = this.tree;
    this.tree = cb({ createComponent, createEntity });
  }
}

export class UISystem extends System {
  componentsRequired = new Set<Function>([UIRootComponent]);

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const root = container.get(UIRootComponent)!;

      this.reconcile(root.prevTree, root.tree);
      this.layout(root.tree, root.layer);
    }
  }

  applyComponentUpdates<T extends Component = Component>(
    component: InstanceType<T>,
    updates: UIComponentElementProps<T> = {}
  ) {
    for (const [key, value] of Object.entries(updates || {})) {
      component[key] = value;
    }
  }

  addComponentElements(
    e: Entity,
    componentData: UIComponentElement | UIComponentElement[]
  ) {
    const componentDataArr = Array.isArray(componentData)
      ? componentData
      : [componentData];

    for (let i = 0; i < componentDataArr.length; i++) {
      const data = componentDataArr[i];
      const component = new data.type(...data.params);
      this.applyComponentUpdates(component, data.updates);
      this.ecs.addComponent(e, component);
    }
  }

  reconcile(
    prevTree?: UIEntityElement,
    tree?: UIEntityElement,
    parent?: Entity
  ) {
    if (tree === prevTree) return;

    if (!tree && prevTree) {
      this.ecs.removeEntity(prevTree.id!);
      return;
    }

    if (tree && !prevTree) {
      const e = this.ecs.addEntity(parent);
      const children = tree.children || [];

      this.addComponentElements(e, tree.components);

      for (let i = 0; i < children.length; i++) {
        this.reconcile(undefined, children[i], e);
      }

      tree.id = e;
      return;
    }

    if (tree && prevTree) {
      const e = prevTree.id!;
      const container = this.ecs.getComponents(e);

      const componentsUpdated = tree.components.slice(
        0,
        prevTree.components.length
      );
      const componentsAdded =
        tree.components.length > prevTree.components.length
          ? tree.components.slice(prevTree.components.length - 1)
          : [];

      for (let i = 0; i < componentsUpdated.length; i++) {
        const componentData = tree.components[i];
        const prevComponentData = prevTree.components[i];

        if (prevComponentData.type !== componentData.type) {
          this.ecs.removeComponent(e, prevComponentData.type);
          if (componentData) this.addComponentElements(e, componentData);
        } else {
          const component = container.get(componentData.type);
          this.applyComponentUpdates(component, componentData.updates);
        }
      }

      if (componentsAdded.length) {
        this.addComponentElements(e, componentsAdded);
      }

      const childrenPrev = prevTree.children || [];
      const children = tree.children || [];
      const childrenUpdated = children.slice(0, childrenPrev.length);
      const childrenAdded =
        children.length > childrenPrev.length
          ? children.slice(childrenPrev.length - 1)
          : [];

      for (let i = 0; i < childrenUpdated.length; i++) {
        this.reconcile(childrenPrev[i], children[i], e);
      }

      for (let i = 0; i < childrenAdded.length; i++) {
        this.reconcile(undefined, children[i], e);
      }

      tree.id = e;
    }
  }

  layout(tree?: UIEntityElement, parentLayer: number = 0) {
    if (!tree) return;

    const children = tree.children || [];
    const container = this.ecs.getComponents(tree.id!);
    const layer = container.get(LayerCompoent);
    const nextLayer = parentLayer + 0.0001;

    if (layer) layer.layer = nextLayer;

    for (let i = 0; i < children.length; i++) {
      this.layout(children[i], nextLayer);
    }
  }
}
