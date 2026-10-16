using Application.Services;
using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Domain.Enums;
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
            , ShoppingListAgentChat shoppingListAgentChat,NotificationService notificationService)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, shoppingListAgentChat,notificationService) { }

        protected override eAgentType _AgentType => eAgentType.ShoppingAgent;
    }
}
