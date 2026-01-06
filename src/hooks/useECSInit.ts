/**
 * useECSInit Hook
 *
 * Ensures ECS world is initialized with inventory data.
 * Importing this module triggers initialization at module load time.
 */

// Import triggers module-level initialization in the system file
import '../ecs/systems/initializeInventorySystem';

export default function useECSInit(): void {
  // No-op hook - initialization happens at module load when the system is imported
  // Kept for API compatibility
}
