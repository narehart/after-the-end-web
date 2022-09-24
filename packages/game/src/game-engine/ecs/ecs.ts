import { GameEngine, Renderer, SystemEvent } from "../game-engine";

export type Entity = number;

export interface Component {
  new (...args: any): any;
}

export class Component {}

export class ParentComponent extends Component {
  constructor(public parent: Entity) {
    super();
  }
}

export class ChildrenComponent extends Component {
  constructor(public children: Entity[] = []) {
    super();
  }
}

export abstract class System {
  public abstract componentsRequired: Set<Function>;
  public ecs!: ECS;
  public ge!: GameEngine;
  public init?(): void;
  public input?(entities: Set<number>, events: SystemEvent): void;
  public update?(entities: Set<number>, timestamp: number): void;
  public render?(entities: Set<number>, renderer: Renderer): void;
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export class ComponentContainer {
  private map = new Map<Function, Component>();

  public add(component: Component): void {
    this.map.set(component.constructor, component);
  }

  public get<T extends Component>(
    componentClass: ComponentClass<T>
  ): T | undefined {
    return this.map.get(componentClass) as T | undefined;
  }

  public has(componentClass: Function): boolean {
    return this.map.has(componentClass);
  }

  public hasAll(componentClasses: Iterable<Function>): boolean {
    for (let cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false;
      }
    }
    return true;
  }

  public delete(componentClass: Function): void {
    this.map.delete(componentClass);
  }
}

export class ECS {
  private nextEntityID = 0;
  private entitiesToDestroy = new Array<Entity>();
  private entities = new Map<Entity, ComponentContainer>();
  private systems = new Map<System, Set<Entity>>();

  constructor(public ge: GameEngine) {}

  public addEntity(parentID?: Entity): Entity {
    const entity = this.nextEntityID;
    const container = new ComponentContainer();

    if (parentID) {
      const parentContainer = this.getComponents(parentID);
      const children = parentContainer.get(ChildrenComponent);

      if (!children) {
        this.addComponent(parentID, new ChildrenComponent([entity]));
      } else if (!children.children.includes(entity)) {
        children.children.push(entity);
      }

      container.add(new ParentComponent(parentID));
    }

    this.nextEntityID++;
    this.entities.set(entity, container);

    return entity;
  }

  public removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  public destroyEntity(entity: Entity): void {
    const container = this.getComponents(entity);
    const parent = container.get(ParentComponent);
    const children = container.get(ChildrenComponent)?.children || [];

    for (let i = 0; i < children.length; i++) {
      this.destroyEntity(children[i]);
    }

    if (parent) {
      const parentContainer = this.getComponents(parent.parent);
      const parentChildren = parentContainer.get(ChildrenComponent);

      if (parentChildren?.children) {
        parentChildren.children = parentChildren.children.filter(
          (e) => e !== entity
        );
      }
    }

    this.entities.delete(entity);

    for (let entities of this.systems.values()) {
      entities.delete(entity); // no-op if doesn't have it
    }
  }

  public addComponent(entity: Entity, component: Component): void {
    this.entities.get(entity)!.add(component);
    this.checkE(entity);
  }

  public getComponents(entity: Entity): ComponentContainer {
    return this.entities.get(entity)!;
  }

  public removeComponent(entity: Entity, componentClass: Function): void {
    this.entities.get(entity)!.delete(componentClass);
    this.checkE(entity);
  }

  private checkE(entity: Entity): void {
    for (let system of this.systems.keys()) {
      this.checkES(entity, system);
    }
  }

  private checkES(entity: Entity, system: System): void {
    let have = this.entities.get(entity);
    let need = system.componentsRequired;
    if (have?.hasAll(need)) {
      this.systems.get(system)!.add(entity); // no-op if already has it
    } else {
      this.systems.get(system)!.delete(entity); // no-op if doesn't have it
    }
  }

  public addSystem(system: System): void {
    if (system.componentsRequired.size == 0) {
      console.warn("System " + system + " not added: empty components list.");
      return;
    }
    system.ecs = this;
    this.systems.set(system, new Set());
    for (let entity of this.entities.keys()) {
      this.checkES(entity, system);
    }
  }

  public removeSystem(system: System): void {
    this.systems.delete(system);
  }

  public init(): void {
    for (let [system] of this.systems.entries()) {
      system.init?.();
    }
  }

  public input(events: SystemEvent): void {
    for (let [system, entities] of this.systems.entries()) {
      system.input?.(entities, events);
    }
  }

  public update(timestamp: number): void {
    for (let [system, entities] of this.systems.entries()) {
      system.update?.(entities, timestamp);
    }
    while (this.entitiesToDestroy.length > 0) {
      this.destroyEntity(this.entitiesToDestroy.pop()!);
    }
  }

  public render(renderer: Renderer): void {
    for (let [system, entities] of this.systems.entries()) {
      system.render?.(entities, renderer);
    }
  }
}
