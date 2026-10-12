using Infrastructure.ExternalServices;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;

namespace Infrastructure.AI
{
    public class ExtractProductsImage
    {
        private readonly GoogleAI _googleAI;
        private GenerativeModel _model;
        private readonly GenerationConfig _generationConfiq;

        private readonly static Content ExtractSysPrompt = new Content(File.ReadAllText(
            Path.Combine(AppContext.BaseDirectory, "Resources", "VisionProductSysPrompt.txt")
        ));

        public ExtractProductsImage(GoogleAI googleAI, GenerationConfig generationConfiq)
        {
            _googleAI = googleAI;
            _generationConfiq = generationConfiq;

            _model = _googleAI.GenerativeModel(Model.Gemini25Flash);
        }

        public async Task<string?> ExtractProductsFromImageAsString(Guid inventoryId,string languageName,string imageUri,string imageType)
        {
            string prompt = $"This is the INVENTORY_ID={inventoryId} and the REQUIRED_LANGUAGE={languageName}, give me the products";

            var request = new GenerateContentRequest(prompt, generationConfig: _generationConfiq, systemInstruction: ExtractSysPrompt);

            await request.AddMedia(imageUri, imageType);

            var response = await _model.GenerateContent(request);

            return response.Text;
        }
    }
}
