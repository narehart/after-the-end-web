import { AnimatedSpriteComponent } from "../components/animated-sprite";
import { SpriteComponent } from "../components/sprite";
import { Entity, System } from "../ecs";

export class AnimatedSpriteSystem extends System {
  private absoluteStart: number = 0;

  componentsRequired = new Set<Function>([AnimatedSpriteComponent]);

  update(entities: Set<Entity>, timestamp: number) {
    if (this.absoluteStart === 0) {
      this.absoluteStart = timestamp;
    }

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const animatedSprite = container.get(AnimatedSpriteComponent);

      if (!animatedSprite) continue;

      if (animatedSprite.start === 0) {
        animatedSprite.start = animatedSprite.absolute
          ? this.absoluteStart
          : timestamp;
      }

      const durations = this.getDurations(animatedSprite);
      const totalDuration = this.getTotalDuration(durations);
      const elapsed = (timestamp - animatedSprite.start) / 1000;

      let x = 0;
      let accumulated = 0;

      for (let i = 0; i < durations.length; i++) {
        const d = durations[i];
        accumulated += d;

        if (elapsed <= accumulated) {
          x = i * animatedSprite.width;
          break;
        }
      }

      const end = elapsed > totalDuration;

      const sprite = this.getSprite(entity, animatedSprite);
      sprite.sx = x;

      if (end && !animatedSprite.loop) {
        this.ecs.removeEntity(entity);
      }

      if (end && animatedSprite.loop) {
        animatedSprite.start = animatedSprite.absolute
          ? animatedSprite.start + totalDuration * 1000
          : timestamp;
      }
    }
  }

  getDurations(animatedSprite: AnimatedSpriteComponent<any>) {
    if (Array.isArray(animatedSprite.duration)) return animatedSprite.duration;

    const { size } = this.ecs.ge.platform.renderer.images[animatedSprite.id];
    const frames = Math.floor(size.x / animatedSprite.width);

    let durations = [];

    for (let i = 0; i < frames; i++) {
      durations.push(animatedSprite.duration);
    }

    return durations;
  }

  getTotalDuration(durations: number[]) {
    let total = 0;

    for (let i = 0; i < durations.length; i++) {
      total += durations[i];
    }

    return total;
  }

  getSprite(entity: Entity, animatedSprite: AnimatedSpriteComponent<any>) {
    const container = this.ecs.getComponents(entity);
    let sprite = container.get(SpriteComponent);

    if (!sprite) {
      sprite = new SpriteComponent(
        animatedSprite.id,
        0,
        0,
        animatedSprite.width
      );
      this.ecs.addComponent(entity, sprite);
    }

    return sprite;
  }
}
