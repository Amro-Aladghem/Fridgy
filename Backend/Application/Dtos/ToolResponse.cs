using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Dtos
{
    public record ToolResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string? Data { get; set; }
    }
}
