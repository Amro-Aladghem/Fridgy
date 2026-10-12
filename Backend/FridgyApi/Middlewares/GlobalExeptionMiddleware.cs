using System.Text.Json;

namespace FridgyApi.MiddleWares
{
    public class GlobalExeptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExeptionMiddleware(RequestDelegate next)
        {
            _next = next;   
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next.Invoke(context);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";

                var response = new
                {
                    message = "Server Error, Please Try Again"
                };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
