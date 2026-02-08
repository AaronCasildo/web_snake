/* tslint:disable */
/* eslint-disable */

export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,
}

export enum GameState {
    Playing = 0,
    GameOver = 1,
    Win = 2,
}

export class World {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    change_snake_direction(direction: Direction): void;
    game_state(): GameState | undefined;
    game_state_lbl(): string;
    static new(width: number, snake_spawn_index: number): World;
    reward(): number;
    snake_cells(): number;
    snake_head(): number;
    snake_size(): number;
    start_game(): void;
    tick(): void;
    width(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_world_free: (a: number, b: number) => void;
    readonly world_change_snake_direction: (a: number, b: number) => void;
    readonly world_game_state: (a: number) => number;
    readonly world_game_state_lbl: (a: number) => [number, number];
    readonly world_new: (a: number, b: number) => number;
    readonly world_reward: (a: number) => number;
    readonly world_snake_cells: (a: number) => number;
    readonly world_snake_head: (a: number) => number;
    readonly world_snake_size: (a: number) => number;
    readonly world_start_game: (a: number) => void;
    readonly world_tick: (a: number) => void;
    readonly world_width: (a: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
