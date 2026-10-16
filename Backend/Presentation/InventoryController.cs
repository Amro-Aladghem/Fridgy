using Application.Dtos;
using Application.Services;
using Application.Services.Coordinators;
using Azure.Core;
using Infrastructure.ExternalServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading.Channels;

namespace Presentation
{
    [Route("api/v1/inventories")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly AgentDecisionService _agentDecisionService;
        private readonly NotificationService _notificationService;
        private readonly Channel<AgentRequestDto> _channel;

        public InventoryController(ChatService chatService, AgentDecisionService agentDecisionService, 
            NotificationService notificationService,Channel<AgentRequestDto> channel)
        {
            _chatService = chatService;
            _agentDecisionService = agentDecisionService;
            _notificationService = notificationService;
            _channel = channel;
        }

        [HttpPost("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ChatDto>> CreateChatForInventory(Guid id,ChatDto chatDto)
        {
            var result = await _chatService.CreateChat(id, chatDto);

            return Ok(result);
        }

        [HttpPost("{inventoryId}/chats/{chatSignuture}")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> ChatWithAgent(AgentRequestDto agentRequestDto,
            Guid inventoryId,Guid chatSignuture,bool askUser=false)
        {
            string? agentType = null;

            if (!askUser && agentRequestDto.AgentType is not null)
            {
                agentType = await _agentDecisionService.GetAgentTypeAfterDecision(agentRequestDto.Message);
                if (agentType is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, "System Error , please try again");
            }

            await _notificationService.CreateNotification(inventoryId, new NotificationDto()
            {
                InventoryId = inventoryId,
                ChatId = chatSignuture,
                AgentType = agentType ?? agentRequestDto.AgentType!,
            });

            agentRequestDto.AgentType=agentType ?? agentRequestDto.AgentType!;
            agentRequestDto.InventoryId=inventoryId;
            agentRequestDto.ChatSignture= chatSignuture;

            await _channel.Writer.WriteAsync(agentRequestDto);
            return Accepted(agentType);
        }


        [HttpGet("{inventoryId}/chats/{chatSignuture}/notifications")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<NotificationDto>>> GetNotificationsForChat(Guid inventoryId,Guid chatSignture)
        {
            var result = await _notificationService.GetNotificationsForChatId(inventoryId, chatSignture);

            return Ok(result);
        }

        [HttpGet("{inventoryId}/chats/{chatSignuture}")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<List<ChatDto>>>  GetChatsHistoryById(Guid inventoryId,Guid chatSignuture)
        {
            var result = await _chatService.GetChatsForChatId(inventoryId,chatSignuture);
            return Ok(result);
        }
    }
}
