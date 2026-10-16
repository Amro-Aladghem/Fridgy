using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Infrastructure.AI;
using Microsoft.Extensions.Configuration;

namespace Application.Agents
{
    public class MonitoringAgent : BaseAgent
    {
        public MonitoringAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator, IConfiguration configuration
            , MonitorAgentChat monitorAgentChat)
            : base(agentChatCoordinator, toolChatCoordinator, configuration, monitorAgentChat) { }

    }
}
