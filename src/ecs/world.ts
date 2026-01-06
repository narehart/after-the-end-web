/**
 * ECS World - The central entity management system
 *
 * This file creates and exports the miniplex World instance that manages
 * all game entities and their components.
 */

import { World } from 'miniplex';
import type { Entity } from '../types/ecs';

export const world = new World<Entity>();
