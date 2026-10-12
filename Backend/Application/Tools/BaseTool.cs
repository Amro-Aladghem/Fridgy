using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Application.Tools
{
    public abstract class BaseTool
    {
        protected async Task<ToolResponse> ExecuteTool<T>(Func<Task<T>>action)
        {
            try
            {
                var result = await action();
                return new ToolResponse()
                {
                    Success = true,
                    Message = "The database operation successed, you can continue your workflow",
                    Data = JsonSerializer.Serialize<T>(result)
                };
            }
            catch (Exception ex)
            {
                return new ToolResponse()
                {
                    Success = false,
                    Message = "The database operation failed. You may retry once only"
                };
            }
        }
    }
}
