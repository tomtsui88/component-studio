import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

const createAzureMock = vi.fn();

vi.mock("@ai-sdk/azure", () => ({
  createAzure: createAzureMock,
}));

describe("getLanguageModel", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    createAzureMock.mockReset();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns mock model when azure credentials are missing", async () => {
    delete process.env.AZURE_API_KEY;
    delete process.env.AZURE_RESOURCE_NAME;

    const { getLanguageModel, MockLanguageModel } = await import("../provider");

    const model = getLanguageModel();

    expect(model).toBeInstanceOf(MockLanguageModel);
    expect(createAzureMock).not.toHaveBeenCalled();
  });

  it("configures azure provider with defaults when credentials exist", async () => {
    process.env.AZURE_API_KEY = "test-key";
    process.env.AZURE_RESOURCE_NAME = "test-resource";
    delete process.env.AZURE_DEPLOYMENT_NAME;

    const azureModel = { id: "azure-model" };
    const azureInstance = vi.fn().mockReturnValue(azureModel);
    createAzureMock.mockReturnValue(azureInstance);

    const { getLanguageModel } = await import("../provider");

    const model = getLanguageModel();

    expect(createAzureMock).toHaveBeenCalledWith({
      resourceName: "test-resource",
      apiKey: "test-key",
    });
    expect(azureInstance).toHaveBeenCalledWith("gpt-4.1");
    expect(model).toBe(azureModel);
  });
});
