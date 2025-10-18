using System.Text.Json;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;
using Serilog.Core;

namespace Group8.LabEms.Api.Middleware
{
    public class AuditLogMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuditLogMiddleware> _logger;

        public AuditLogMiddleware(RequestDelegate next, ILogger<AuditLogMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext db)
        {
            // Let the request continue through the pipeline
            await _next(context);


            var path = context.Request.Path.Value?.ToLower() ?? "";
            string[] ignoredPaths = { "/api/health", "/swagger", "/favicon.ico", "/api/auth/login" };

            if (ignoredPaths.Any(p => path.StartsWith(p)))
                return;

            // Only log certain HTTP methods (you can customize)
            var method = context.Request.Method;
            //if (method != HttpMethods.Post && method != HttpMethods.Put && method != HttpMethods.Delete)
            //    return;

            try
            {

                int? userId = GetUserId(context); // extract user ID from claims or token
                path = context.Request.Path.Value ?? "";
                var entityType = GetEntityTypeFromPath(path);
                var action = GetActionFromMethod(method);
                var entityId = GetEntityIdFromPath(path);
                var details = new
                {
                    Path = path,
                    Method = method,
                    StatusCode = context.Response.StatusCode
                };

                var log = new AuditLogModel
                {
                    UserId = userId,
                    Action = action,
                    EntityType = entityType,
                    EntityId = entityId,
                    Details = JsonSerializer.Serialize(details),
                    TimeStamp = DateTime.Now
                };

                db.AuditLogs.Add(log);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log or swallow errors so audit logging never breaks the app
                _logger.LogError(ex,
                    "Error while writing audit log for {Method} {Path}. StatusCode={StatusCode}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode);
            }
        }

        private static int? GetUserId(HttpContext context)
        {
            if (context.User?.Identity?.IsAuthenticated != true)
                return null;

            var claim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null)
                return null;

            if (int.TryParse(claim.Value, out int userId))
                return userId;

            return null;
        }


        private string GetActionFromMethod(string method)
        {
            return method switch
            {
                "GET" => "GET",
                "POST" => "CREATE",
                "PUT" => "UPDATE",
                "DELETE" => "DELETE",
                _ => "UNKNOWN"
            };
        }

        private string GetEntityTypeFromPath(string path)
        {
            // Example: /api/equipment/5  -> "Equipment"
            var parts = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length >= 2 ? Capitalize(parts[1]) : "Unknown";
        }

        private int GetEntityIdFromPath(string path)
        {
            var parts = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length >= 3 && int.TryParse(parts[2], out int id))
                return id;
            return 0;
        }

        private string Capitalize(string str)
        {
            if (string.IsNullOrEmpty(str)) return str;
            return char.ToUpper(str[0]) + str.Substring(1).ToLower();
        }
    }

    // Extension method for cleaner registration
    public static class AuditLogMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuditLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuditLogMiddleware>();
        }
    }
}
