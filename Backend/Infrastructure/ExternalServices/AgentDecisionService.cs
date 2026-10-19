namespace Infrastructure.ExternalServices
{
    using Domain.Enums;
    using Microsoft.Extensions.Configuration;
    using System.Net.Http.Headers;
    using System.Net.Http.Json;
    using System.Text.Json;

    public class AgentDecisionService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AgentDecisionService(
            HttpClient httpClient,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GetAgentTypeAsync(
            string userMessage,
            CancellationToken cancellationToken = default)
        {
            var apiKey = _configuration["OpenRouter:ApiKey"]
                ?? throw new InvalidOperationException(        
                    "OpenRouter API key is missing.");

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://openrouter.ai/api/alpha/decisions");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            request.Content = JsonContent.Create(new
            {
                model = "microsoft/microsoft-decision-1",

                state = userMessage,

                questions = new
                {
                    agent = new
                    {
                        type = "choice",

                        instructions = """
                            You are routing a user's message to the single most
                            appropriate agent in a refrigerator and freezer inventory
                            management system.

                            Read the user's message and select the agent whose
                            responsibilities best match the user's primary intent.

                            Select exactly one agent. Base your decision on the
                            requested action, not merely on keywords in the message.
                         """,

                        criteria = new Dictionary<string, string>
                        {
                           ["InventoryAgent"] = """
                            Responsible for managing inventory records and products.
                            Select this agent when the user wants to add, retrieve,
                            search for, update, or delete products, or manage product
                            quantities and inventory information.
                            """,

                           ["ShoppingAgent"] = """
                            Responsible for shopping lists and purchasing needs.
                            Select this agent when the user wants to create, view,
                            or manage a shopping list, or determine which products
                            need to be purchased.
                            """,

                            ["NoMatch"] =
                            """
                            The request is unrelated to inventory management, shopping lists, 
                            product expiration monitoring, or cooking. Choose this option if none of 
                            the other agents can handle the user's request.
                            """
                        }
                    }
                }
            });

            using var response = await _httpClient.SendAsync(
                request, cancellationToken);

            response.EnsureSuccessStatusCode();

            using var document = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync(
                    cancellationToken),
                cancellationToken: cancellationToken);

            var agentName = document.RootElement
                .GetProperty("answers")
                .GetProperty("agent")
                .GetProperty("choice")
                .GetString();

            return agentName switch
            {
                "InventoryAgent" => eAgentType.InventoryAgent.ToString(),
                "ShoppingAgent" => eAgentType.ShoppingAgent.ToString(),
                "NoMatch" => throw new InvalidOperationException(
                    $"Unknown agent returned by decision model: {agentName}"),
                _ => throw new InvalidOperationException(
                    $"Unknown agent returned by decision model: {agentName}")
            };
        }
    }
}
