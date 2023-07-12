import * as Effect from "@effect/io/Effect";
import { pipe } from "@effect/data/Function";
import * as NodeFS from "node:fs/promises";
import { glob } from "glob";
import * as Str from "./lib/Str";
const DIRECTORY = "./data/psalms";

const readFile = (path: string) =>
  Effect.tryPromise({
    try: () => NodeFS.readFile(path),
    catch: (error) => new Error(`Failed to read file: ${error}`),
  });

const program = Effect.gen(function* ($) {
  const files = yield* $(
    Effect.tryPromise({
      try: () => glob(`${DIRECTORY}/*.txt`),
      catch: (error) =>
        new Error(`Failed to read files in directory: ${DIRECTORY}. ${error}`),
    })
  );

  const buffers = yield* $(Effect.forEach(files, readFile));
  const contents = yield* $(
    Effect.forEach(buffers, (buffer) =>
      Effect.try({
        try: () => buffer.toString(),
        catch: (error) =>
          new Error(`Failed to convert buffer to string: ${error}`),
      })
    )
  );

  const groups = yield* $(
    Effect.forEach(contents, (content) => Effect.succeed(Str.group(content)))
  );
});

Effect.runPromiseExit(program);
