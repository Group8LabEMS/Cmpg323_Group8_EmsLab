using Group8.LabEms.Api.AuthenticationHandler;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Group8.LabEms.Api.Services.Interfaces;


namespace Group8.LabEms.Api.Services
{
    public static class AuthService
    {

        public static void AddAuthService(IServiceCollection services)
        {

            services.AddSingleton<IPermissionService, PermissionService>();
            services.AddSingleton<IOAuth2Service, OAuth2Service>();

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