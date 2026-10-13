using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;
using System.Text.Json;

namespace Infrastructure.AI
{
    public class InventoryAgentChat : IAgentChat
    {
        private readonly GoogleAI _googleAI;
        private GenerativeModel _model;
        private readonly GenerationConfig _generationConfiq;

        public InventoryAgentChat(GoogleAI googleAI, GenerationConfig generationConfiq)
        {
            _googleAI = googleAI;
            _generationConfiq = generationConfiq;

            _model = _googleAI.GenerativeModel(Model.Gemini25Flash);
        }

        private readonly static Content InventoryAgentSysPrompt = new Content(File.ReadAllText(
            Path.Combine(AppContext.BaseDirectory, "Resources", "InventoryAgentSysPrompt.txt")
        ));

        private string CreateFormatedPrompt(object? messagesContext, string message, string role, Guid inventoryId)
        {
            string messagesContextAsString = "There is no previous context yet";

            if (messagesContext is not null)
                messagesContextAsString = "The Previous Context:" + JsonSerializer.Serialize(messagesContext);

            string prompt = $"The INVENTORY_ID={inventoryId},{messagesContext},What to do now:{message} From {role}";

            return prompt ;
        }

        public async Task<string?> Chat(Guid inventoryId, object? messagesContext, string message, string role)
        {

            string prompt = CreateFormatedPrompt(messagesContext, message, role, inventoryId);

            var request = new GenerateContentRequest(prompt, generationConfig: _generationConfiq, systemInstruction: InventoryAgentSysPrompt);

            var response = await _model.GenerateContent(request);

            return response.Text;
        }
    }
}
