using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Group8.LabEms.Api.Services.Interfaces;


namespace Group8.LabEms.Api.AuthenticationHandler
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IPermissionService _permissionService;

        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            IPermissionService permissionService)
            : base(options, logger, encoder)
        {
            _permissionService = permissionService;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                // No authorization header found, return failure
                return AuthenticateResult.Fail("Missing Authorization header");
            }

            string? authHeader = Request.Headers["Authorization"];

            if (authHeader is null)
            {
                return AuthenticateResult.Fail("Missing Authorization header");
            }

            if (!authHeader.StartsWith("Basic "))
            {
                // Invalid authorization header format, return failure
                return AuthenticateResult.Fail("Invalid Authorization header format");
            }

            string encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
            byte[] decodedBytes = Convert.FromBase64String(encodedUsernamePassword);
            string decodedUsernamePassword = Encoding.UTF8.GetString(decodedBytes);
            string[] parts = decodedUsernamePassword.Split(':', 2);
            string username = parts[0];
            string password = parts[1];

            if (!_permissionService.IsValidUser(username, password))
            {
                // Invalid username or password, return failure
                return AuthenticateResult.Fail("Invalid username or password");
            }

            // Authentication succeeded, return success
            var claims = new[] {
                new Claim(ClaimTypes.Name, username),
            };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            return AuthenticateResult.Success(ticket);
        }
    }
}
