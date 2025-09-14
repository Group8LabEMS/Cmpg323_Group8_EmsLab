using System.IdentityModel.Tokens.Jwt;

namespace Group8.LabEms.Api.Services.Interfaces
{
    public interface IOAuth2Service
    {
        bool Authenticate(string token);
    }
}