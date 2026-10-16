
using Application.Dtos;
using Application.Services;
using Application.Services.Coordinators;
using Domain.Enities;
using Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Channels;

namespace Infrastructure.Backgroundworkers
{
    public class AgentBackgroundWorker : BackgroundService
    {
        private readonly Channel<AgentRequestDto> _channel;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly NotificationService _notificationService;
        public AgentBackgroundWorker(
            Channel<AgentRequestDto> channel,
            IServiceScopeFactory scopeFactory,
            NotificationService notificationService)
        {
            _channel = channel;
            _scopeFactory = scopeFactory;
            _notificationService = notificationService;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            await foreach (
                var job in _channel.Reader.ReadAllAsync(stoppingToken))
            {
                try
                {
                    await using var scope =
                        _scopeFactory.CreateAsyncScope();

                    var executionService = scope.ServiceProvider
                        .GetRequiredService<AgentExecutionService>();

                    await _notificationService.CreateNotification(job.InventoryId, new NotificationDto()
                    {
                        ChatId = job.ChatSignture!.Value,
                        AgentType = job.AgentType,
                        NotificationStatus = eNotificationStatus.Running.ToString(),
                    });

                    await executionService.ExecutAgent(
                        job,
                        job.AgentType!);
                }
                catch (OperationCanceledException)
                    when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch
                {
                }
            }
        }
    }
}
