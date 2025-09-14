using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Group8.LabEms.Api.Services.Interfaces;


namespace Group8.LabEms.Api.AuthenticationHandler;

public class OAuth2AuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IOAuth2Service _oAuth2Service;
    private readonly IPermissionService _permissionService;

    public OAuth2AuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IOAuth2Service oAuth2Service,
        IPermissionService permissionService)
        : base(options, logger, encoder)
    {
        _oAuth2Service = oAuth2Service;
        _permissionService = permissionService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        string? authHeader;

        if (!Request.Headers.ContainsKey("Authorization"))
        {
            // No authorization header found, return failure
            return AuthenticateResult.Fail("Missing Authorization header");
        }
        else
        {
            authHeader = Request.Headers["Authorization"].ToString();
        }

        
        if (!authHeader.StartsWith("BearerToken "))
        {
            // Invalid authorization header format, return failure
            return AuthenticateResult.Fail("Invalid Authorization header format");
        }

        string token = authHeader.Substring("BearerToken ".Length).Trim();


        string nameClaim = new JwtSecurityTokenHandler().ReadJwtToken(token).Claims.ToArray()[1].ToString();


        if (nameClaim.Substring(nameClaim.IndexOf(":") + 2) != "John Doe")
        {
            // Invalid username or password, return failure
            return AuthenticateResult.Fail("Invalid token");
        }


        if (!_oAuth2Service.Authenticate(token))
        {
            // Invalid username or password, return failure
            return AuthenticateResult.Fail("Invalid token");
        }

        // Authentication succeeded, return success
        var claims = new List<Claim>();
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);
        return AuthenticateResult.Success(ticket);
    }

    private string indexOf() => throw new NotImplementedException();
}
