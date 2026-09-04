import type { Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { healthCheck, notFound } from "./app.js";
import { supabaseAdmin } from "./lib/supabase.js";

function createResponse(): Pick<Response, "status" | "json"> {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

describe("health endpoints", () => {
  it("returns an unauthenticated liveness response", async () => {
    const response = createResponse();
    healthCheck({} as never, response as Response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ status: "ok" });
  });

  it("returns a predictable not-found response", async () => {
    const response = createResponse();
    notFound({} as never, response as Response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  it("initializes a server-only Supabase client", () => {
    expect(supabaseAdmin).toBeDefined();
  });
});
