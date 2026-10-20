using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Infrastructure.AI
{
    public class MonitorAgentChat : IAgentChat
    {
        private readonly GoogleAI _googleAI;
        private GenerativeModel _model;
        private readonly GenerationConfig _generationConfiq;

        public MonitorAgentChat(GoogleAI googleAI, GenerationConfig generationConfiq)
        {
            _googleAI = googleAI;
            _generationConfiq = generationConfiq;

            _model = _googleAI.GenerativeModel(Model.Gemini25Flash);
        }

        private readonly static Content MonitorAgentSysPrompt = new Content(File.ReadAllText(
            Path.Combine(AppContext.BaseDirectory, "Resources", "MonitorAgentSysPrompt.txt")
        ));

        private string CreateFormatedPrompt(object? messagesContext, Guid inventoryId)
        {
            string messagesContextAsString = "There is no previous context yet";

            if (messagesContext is not null)
                messagesContextAsString = "The Chat Context:" + JsonSerializer.Serialize(messagesContext);

            string dateTime = DateTime.UtcNow.Date.ToString("yyyy//mm//dd");

            string prompt = $"The INVENTORY_ID={inventoryId},{messagesContextAsString} , Current Date(yyyy//mm//dd) Is :{dateTime}";

            return prompt;
        }

        public async Task<string?> Chat(Guid inventoryId, object? messagesContext)
        {

            string prompt = CreateFormatedPrompt(messagesContext, inventoryId);

            var request = new GenerateContentRequest(prompt, generationConfig: _generationConfiq, systemInstruction: MonitorAgentSysPrompt);

            var response = await _model.GenerateContent(request);

            return response.Text;
        }
    }
}
