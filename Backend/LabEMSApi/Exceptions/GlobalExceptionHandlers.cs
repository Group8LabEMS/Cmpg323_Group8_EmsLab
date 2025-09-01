using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace LabEMSApi.Exceptions
{

    /*
        REFER TO THE ARTICLE FOR THE PURPOSE AND SEMANTICS
        https://www.c-sharpcorner.com/article/global-exception-handling-in-asp-net-core-web-api/
        DATE : 01 SEP 2025
    */
    public class GlobalExceptionsHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionsHandler> _logger;

        public GlobalExceptionsHandler(ILogger<GlobalExceptionsHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

            var problemDetails = new ProblemDetails
            {
                Status = exception switch
                {
                    ArgumentNullException or ArgumentException => StatusCodes.Status400BadRequest,
                    KeyNotFoundException => StatusCodes.Status404NotFound,
                    UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                    _ => StatusCodes.Status500InternalServerError
                },
                Type = exception.GetType().Name,
                Title = "An error occurred",
                Detail = exception.Message,
                Instance = httpContext.Request.Path
            };

            // Add additional properties for development
            if (httpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment())
            {
                problemDetails.Extensions.Add("stackTrace", exception.StackTrace);
            }

            httpContext.Response.StatusCode = problemDetails.Status.Value;
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true;
        }
    }
}