using Application.Dtos;
using Application.Tools;
using FluentValidation;
using FridgyApi.MiddleWares;
using Infrastructure.Backgroundworkers;
using Infrastructure.Data;
using Infrastructure.ExternalServices;
using Microsoft.EntityFrameworkCore;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;
using System.Reflection;
using System.Threading.Channels;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetSection("SQL_CONNECTION_STRING").Value));

builder.Services.AddSingleton<GoogleAI>(sp => new GoogleAI(apiKey: builder.Configuration.GetSection("geminiApi").Value!));
builder.Services.AddSingleton<GenerationConfig>(gc => new GenerationConfig() { ResponseMimeType = "application/json", Temperature = 0 });

builder.Services.AddSingleton<Channel<AgentRequestDto>>(
    _ => Channel.CreateUnbounded<AgentRequestDto>()
);

var applicationAssembly = typeof(IAgentTool).Assembly;
var infrastructureAssembly = typeof(AppDbContext).Assembly;

var serviceNamespaces = new (Assembly Assembly, string Namespace)[]
{
    (applicationAssembly, "Application.Services"),
    (applicationAssembly, "Application.Services.Coordinators"),
    (applicationAssembly, "Application.Agents"),
    (applicationAssembly, "Application.Tools.Coordinator"),
    (infrastructureAssembly, "Infrastructure.AI"),
};

foreach (var (assembly, targetNamespace) in serviceNamespaces)
{
    var serviceTypes = assembly.GetTypes()
        .Where(type => type.IsClass && !type.IsAbstract && type.Namespace == targetNamespace);

    foreach (var serviceType in serviceTypes)
        builder.Services.AddScoped(serviceType);
}

var toolTypes = applicationAssembly.GetTypes()
    .Where(type => type.IsClass && !type.IsAbstract && typeof(IAgentTool).IsAssignableFrom(type));

foreach (var toolType in toolTypes)
{
    builder.Services.AddScoped(toolType);
    builder.Services.AddScoped(typeof(IAgentTool), provider => provider.GetRequiredService(toolType));
}

builder.Services.AddScoped<ToolExecutor>();
builder.Services.AddHttpClient<AgentDecisionService>();
builder.Services.AddScoped<BlobStorageUploadService>();

builder.Services.AddHostedService<AgentBackgroundWorker>();

builder.Services.AddValidatorsFromAssembly(typeof(Application.Validators.ProductDtoValidator).Assembly);

builder.Services.AddControllers()
    .AddApplicationPart(typeof(Presentation.AssemblyReference).Assembly);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<GlobalExeptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
