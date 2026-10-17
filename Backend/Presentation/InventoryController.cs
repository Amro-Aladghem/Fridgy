using Application.Dtos;
using Application.Services;
using Application.Services.Coordinators;
using Azure.Core;
using Domain.Enums;
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
        private readonly ProductService _productService;
        private readonly ShoppingListService _shoppingListService;
        private readonly Channel<AgentRequestDto> _channel;

        public InventoryController(ChatService chatService, AgentDecisionService agentDecisionService, 
            NotificationService notificationService, ProductService productService,
            ShoppingListService shoppingListService, Channel<AgentRequestDto> channel)
        {
            _chatService = chatService;
            _agentDecisionService = agentDecisionService;
            _notificationService = notificationService;
            _productService = productService;
            _shoppingListService = shoppingListService;
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
            Guid inventoryId,Guid chatSignuture,[FromQuery]bool askUser=false)
        {
            string? agentType = null;

            if (!askUser && agentRequestDto.AgentType is not null)
            {
                agentType = await _agentDecisionService.GetAgentTypeAsync(agentRequestDto.Message);
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

        [HttpPost("{inventoryId}/chats/{chatSignuture}/monitor")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> CallingMonitorAgent(AgentRequestDto agentRequestDto,
            Guid inventoryId, Guid chatSignuture)
        {

            string monitorAgent = eAgentType.MonitoringAgent.ToString();

            await _notificationService.CreateNotification(inventoryId, new NotificationDto()
            {
                InventoryId = inventoryId,
                ChatId = chatSignuture,
                AgentType = monitorAgent
            });

            agentRequestDto.AgentType = monitorAgent;
            agentRequestDto.InventoryId = inventoryId;
            agentRequestDto.ChatSignture = chatSignuture;

            await _channel.Writer.WriteAsync(agentRequestDto);
            return Accepted(monitorAgent);
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

        [HttpGet("{inventoryId}/shoppinglists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ShoppingListDto>>> GetShoppingListsHistory(Guid inventoryId)
        {
            var result = await _shoppingListService.GetShoppingListsForInventory(inventoryId);

            return Ok(result);
        }

        [HttpGet("{inventoryId}/products/expired")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ProductDto>>> GetExpiredProducts(Guid inventoryId)
        {
            var result = await _productService.GetExpiredProducts(inventoryId);

            return Ok(result);
        }

        [HttpGet("{inventoryId}/products")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ProductDto>>> GetProducts(Guid inventoryId)
        {
            var result = await _productService.GetProducts(inventoryId);

            return Ok(result);
        }

        [HttpPut("{inventoryId}/products/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductDto>> UpdateProduct(Guid inventoryId, Guid id, ProductDto productDto)
        {
            var result = await _productService.UpdateProductById(inventoryId, id, productDto);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("{inventoryId}/products/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteProduct(Guid inventoryId, Guid id)
        {
            var result = await _productService.DeleteProduct(inventoryId, id);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}
