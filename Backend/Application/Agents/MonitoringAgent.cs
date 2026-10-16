using Application.Services;
using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Domain.Enums;
using Infrastructure.AI;
using Microsoft.Extensions.Configuration;

namespace Application.Agents
{
    public class MonitoringAgent : BaseAgent
    {
        public MonitoringAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator, IConfiguration configuration
            , MonitorAgentChat monitorAgentChat,NotificationService notificationService)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, monitorAgentChat,notificationService) { }

        protected override eAgentType _AgentType => eAgentType.MonitoringAgent;
    }
}
