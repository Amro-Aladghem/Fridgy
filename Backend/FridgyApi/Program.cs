using Application.Services;
using FridgyApi.MiddleWares;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetSection("SQL_CONNECTION_STRING").Value));

builder.Services.AddSingleton<GoogleAI>(sp => new GoogleAI(apiKey: builder.Configuration.GetSection("geminiApi").Value!));
builder.Services.AddSingleton<GenerationConfig>(gc => new GenerationConfig() { ResponseMimeType = "application/json", Temperature = 0 });


builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<ShoppingListService>();
builder.Services.AddScoped<ShoppingListProductService>();

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
