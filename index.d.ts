/// <reference types="node" />
import { PathLike } from 'fs';
export declare function transpileFile(filepath: PathLike | number): {
  transpiled: string;
  original: string | Buffer;
};
export declare function transpileScript(origContent: string | Buffer): {
  transpiled: string;
  original: string | Buffer;
};
export declare function hasDebugLogs(originalContent: string): boolean;