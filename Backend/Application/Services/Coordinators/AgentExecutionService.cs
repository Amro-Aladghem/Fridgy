using Application.Agents;
using Application.Dtos;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Coordinators
{
    public class AgentExecutionService
    {
        private readonly InventoryAgent _inventoryAgent;
        private readonly MonitoringAgent _monitoringAgent;
        private readonly ShoppingListAgent _shoppingListAgent;

        public AgentExecutionService(InventoryAgent inventoryAgent, MonitoringAgent monitoringAgent, ShoppingListAgent shoppingListAgent)
        {
            _inventoryAgent = inventoryAgent;
            _monitoringAgent = monitoringAgent;
            _shoppingListAgent = shoppingListAgent;
        }

        public async Task<AgentRunResultDto> ExecutAgent(AgentRequestDto agentRequestDto,string agentType)
        {
            eAgentType type = Enum.Parse<eAgentType>(agentType);

            BaseAgent agent = type switch
            {
                eAgentType.InventoryAgent => _inventoryAgent,
                eAgentType.ShoppingAgent => _shoppingListAgent,
                eAgentType.MonitoringAgent => _monitoringAgent,
                _ => throw new ArgumentOutOfRangeException(nameof(agentType))
            };

            return await agent.RunAsync(agentRequestDto);
        }
    }
}
