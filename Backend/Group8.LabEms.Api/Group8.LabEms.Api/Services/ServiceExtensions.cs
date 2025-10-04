using Group8.LabEms.Api.Services.Interfaces;

namespace Group8.LabEms.Api.Services
{
    public static class ServiceExtensions
    {
        /// <summary>
        /// Registers all business services from the Services directory
        /// </summary>
        /// <param name="services">The service collection</param>
        /// <returns>The service collection for chaining</returns>
        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            // Register all services from the Services directory
            services.AddScoped<INotificationService, NotificationService>();

            return services;
        }
    }
}