using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public interface IAgentTool
    {
        public string Name { get;  }
        public Type ArgType { get;  }
        public Task<ToolResponse> ExecuteAsync(object arg);
    }
}
