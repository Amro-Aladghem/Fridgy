using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetDateNowTool : BaseTool, IAgentTool
    {
        public string Name => "GetDateNowTool";

        public Type ArgType => typeof(void);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            Task<string> dateTask = new Task<string>(() => DateTime.Today.ToString("yyyy-MM-dd"));

            return await ExecuteTool<string>(() => dateTask);
        }
    }
}
