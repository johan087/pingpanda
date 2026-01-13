import { Context, Hono, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { MiddlewareHandler, Variables } from "hono/types";
import { StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { Bindings } from "../env";
import { bodyParsingMiddleware, queryParsingMiddleware } from "./middleware";
import { MutationOperation, QueryOperation } from "./types";

type OperationType<I extends Record<string, unknown>, O> =
  | QueryOperation<I, O>
  | MutationOperation<I, O>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const router = <T extends Record<string, OperationType<any, any>>>(
  obj: T
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = new Hono<{ Bindings: Bindings; Variables: any }>().onError(
    (err, c) => {
      if (err instanceof HTTPException) {
        return c.json(
          {
            error: "Server Error",
            message: err.message,
            type: "HTTPException",
          },
          err.status
        );
      } else {
        return c.json(
          {
            error: "Unknown Error",
            message: "An unexpected error occurred",
            type: "UnknownError",
          },
          500
        );
      }
    }
  );

  Object.entries(obj).forEach(([key, operation]) => {
    const path = `/${key}` as const;

    const operationMiddlewares: MiddlewareHandler[] = operation.middlewares.map(
      (middleware) => {
        const wrapperFunction = async (c: Context, next: Next) => {
          const ctx = c.get("__middleware_output") ?? {};

          const nextWrapper = <B>(args: B) => {
            c.set("__middleware_output", { ...ctx, ...args });
            return { ...ctx, ...args };
          };

          const res = await middleware({ ctx, next: nextWrapper, c });
          c.set("__middleware_output", { ...ctx, ...res });

          await next();
        };

        return wrapperFunction;
      }
    );

    if (operation.type === "query") {
      if (operation.schema) {
        const queryHandlers = [
          queryParsingMiddleware,
          ...operationMiddlewares,
          async (c: Context) => {
            const ctx = c.get("__middleware_output") || {};
            const parsedQuery = c.get("parsedQuery");

            let input;
            try {
              input = operation.schema?.parse(parsedQuery);
            } catch (err) {
              if (err instanceof ZodError) {
                throw new HTTPException(400, {
                  cause: err,
                  message: err.message,
                });
              } else {
                throw err;
              }
            }

            return await operation.handler({ c, ctx, input });
          },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (route.get as any)(path, ...queryHandlers);
      } else {
        const queryHandlers = [
          ...operationMiddlewares,
          async (c: Context) => {
            const ctx = c.get("__middleware_output") || {};

            return await operation.handler({ c, ctx, input: undefined });
          },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (route.get as any)(path, ...queryHandlers);
      }
    } else if (operation.type === "mutation") {
      if (operation.schema) {
        const postHandlers = [
          bodyParsingMiddleware,
          ...operationMiddlewares,
          async (c: Context) => {
            const ctx = c.get("__middleware_output") || {};
            const parsedBody = c.get("parsedBody");

            let input;
            try {
              input = operation.schema?.parse(parsedBody);
            } catch (err) {
              if (err instanceof ZodError) {
                throw new HTTPException(400, {
                  cause: err,
                  message: err.message,
                });
              } else {
                throw err;
              }
            }

            return await operation.handler({ c, ctx, input });
          },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (route.post as any)(path, ...postHandlers);
      } else {
        const postHandlers = [
          ...operationMiddlewares,
          async (c: Context) => {
            const ctx = c.get("__middleware_output") || {};

            return await operation.handler({ c, ctx, input: undefined });
          },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (route.post as any)(path, ...postHandlers);
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type InferInput<T> = T extends OperationType<infer I, any>
    ? I
    : Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type InferOutput<T> = T extends OperationType<any, infer I>
    ? I
    : Record<string, unknown>;

  return route as Hono<
    { Bindings: Bindings; Variables: Variables },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [K in keyof T]: T[K] extends QueryOperation<any, any>
        ? {
            $get: {
              input: InferInput<T[K]>;
              output: InferOutput<T[K]>;
              outputFormat: "json";
              status: StatusCode;
            };
          }
        : {
            $post: {
              input: InferInput<T[K]>;
              output: InferOutput<T[K]>;
              outputFormat: "json";
              status: StatusCode;
            };
          };
    }
  >;
};
