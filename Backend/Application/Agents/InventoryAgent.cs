using Application.Dtos;
using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Infrastructure.AI;
using Microsoft.Extensions.Configuration;

namespace Application.Agents
{
    public class InventoryAgent : BaseAgent
    {
        public InventoryAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator, IConfiguration configuration
            , InventoryAgentChat inventoryAgentChat)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, inventoryAgentChat) { }
    }
}
