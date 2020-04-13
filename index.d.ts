/// <reference types="node" />
import { PathLike } from 'fs';
export declare function transpileFile(filepath: PathLike | number): string;
export declare function transpileScript(origContent: string | Buffer): string;
export declare function hasDebugLogs(originalContent: string): boolean;
