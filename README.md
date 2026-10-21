# Fridgy

Fridgy is an AI-powered fridge inventory assistant. You talk to it, and it manages your kitchen for you: your products, their expiry dates, and your shopping lists — through natural conversation (text or images).

## 1. What Fridgy Does

- Tracks what is in your fridge: products, quantities, and statuses.
- Watches expiry dates and warns you before products go bad.
- Builds and manages smart shopping lists.
- Lets you manage everything by simply chatting with it.

### From Message to Response

- The user sends a message (text and/or an image) to the chat endpoint.
- The message is stored as a chat row, and the request is routed to the right agent.
- The request is queued into an in-memory channel and the API responds `202 Accepted` immediately.
- A background worker picks up the request and runs the selected agent.
- The agent reasons with the AI model, calls tools when it needs data, and saves every step in the chat history.
- When it finishes, the agent creates a notification: `Completed`, `WaitingForUser` (asked the user a question), or `Failed`.
- The user reads the final answer from the chat history and the notification feed.

## 2. The AI Engine (BaseAgent)

`BaseAgent` is the single engine that powers **all** agents — there is one shared engine, not one per agent. An agent is just a configuration of it: an agent type plus its own system prompt.

At a high level, the engine loop:

- Loads the chat context for the conversation (filtered to that agent's own rows only).
- Sends the context to the AI model (Gemini) with the agent's system prompt.
- Parses the model's JSON decision: answer, ask the user, or use a tool.
- Executes a tool if requested, saves the result, and loops again.
- Finishes with `IsFinished`, `AskUser`, or an error (with a retry limit).

Current agents:

- **InventoryAgent** — adds, searches, updates, , deletes products and any inventory actions.
- **ShoppingListAgent** — creates and manages shopping lists.
- **MonitoringAgent** — monitors expiry/status, suggests actions , update products images.

## 3. Tools & Services

Tools are the small operations the AI agents decide to call. Each tool calls a **service**, and the services do the actual work (database access, external providers, storage).

Tool groups:

- **Database tools** — create, read, update, and delete products, inventories, and shopping lists.
- **Vision / extract tool** — turns an uploaded image into recognized products.
- **External tools** (e.g. web search) — planned for the future.

## 4. Configuration

The `Backend/Configuration` folder contains `appsettings.Development.example.json`, an example of the required `appsettings.Development.json`.

- Copy the example next to `Backend/FridgyApi/appsettings.json` as `appsettings.Development.json` and fill in your own values.
- **Never commit real keys, connection strings, or secrets** — the example uses placeholders only.

The file defines: SQL connection string, Gemini API key, AI retry count, OpenRouter API key (agent routing), and the Azure blob storage settings for product images.

## 5. Running the Backend

From the `Backend/` folder:

**Create the database schema with EF Core migrations:**

```bash
dotnet ef migrations add <MigrationName> --project FridgyApi/FridgyApi.csproj --startup-project FridgyApi/FridgyApi.csproj

dotnet ef database update --project FridgyApi/FridgyApi.csproj --startup-project FridgyApi/FridgyApi.csproj
```

**Run the API:**

```bash
dotnet run --project FridgyApi/FridgyApi.csproj
```

The API runs on `http://localhost:5112` under the `api/v1/inventories` routes.

## 6. Running the Frontend

```bash
cd Frontend/my-app
npm run dev
```

## 7. Contributing

Contributions are welcome! Feel free to open a pull request: fork the repo, create a feature branch, commit your changes, and describe your PR clearly.

**Author:** Amro Aladghem
