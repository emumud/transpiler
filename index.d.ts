/// <reference types="node" />
import { promises as fs, PathLike } from 'fs';
export declare function transpileFile(filepath: PathLike | fs.FileHandle): Promise<{
    transpiled: string;
    original: string | Buffer;
}>;
export declare function transpileScript(origContent: string | Buffer): {
    transpiled: string;
    original: string | Buffer;
};
export declare function hasDebugLogs(originalContent: string): boolean;
