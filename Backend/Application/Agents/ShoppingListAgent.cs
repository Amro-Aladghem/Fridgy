using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Infrastructure.AI;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Agents
{
    public class ShoppingListAgent : BaseAgent
    {
        public ShoppingListAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator, IConfiguration configuration
            , ShoppingListAgentChat shoppingListAgentChat)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, shoppingListAgentChat) { }
    }
}
