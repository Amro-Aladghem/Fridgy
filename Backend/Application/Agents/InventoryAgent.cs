using Application.Dtos;
using Application.Services;
using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Domain.Enums;
using Infrastructure.AI;
using Microsoft.Extensions.Configuration;

namespace Application.Agents
{
    public class InventoryAgent : BaseAgent
    {
        public InventoryAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator, IConfiguration configuration
            , InventoryAgentChat inventoryAgentChat,NotificationService notificationService)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, inventoryAgentChat,notificationService) { }

        protected override eAgentType _AgentType => eAgentType.InventoryAgent;
    }
}
