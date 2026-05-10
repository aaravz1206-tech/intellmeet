import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";

/**
 * Returns the typed backend actor and its loading state.
 * All data operations must go through this hook.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}
