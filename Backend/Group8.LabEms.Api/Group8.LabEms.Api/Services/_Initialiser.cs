using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using Group8.LabEms.Api.Services.Interfaces;
using Group8.LabEms.Api.AuthenticationHandler;
using Microsoft.AspNetCore.Authentication;

namespace Group8.LabEms.Api.Services
{
    public static class Initialiser
    {
        public static void AddProjectServices(this IServiceCollection services)
        {
            services.AddSingleton<IOAuth2Service, OAuth2Service>();
            services.AddTransient<IPermissionService, PermissionService>();
            services.AddAuthService();
        }


        public static void AddAuthService(this IServiceCollection services)
        {
            // Add authentication services
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "BasicAuthentication";
                options.DefaultChallengeScheme = "BasicAuthentication";

            })
            .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null)
            .AddScheme<AuthenticationSchemeOptions, OAuth2AuthenticationHandler>("OAuth2", null);
        }
    }
}