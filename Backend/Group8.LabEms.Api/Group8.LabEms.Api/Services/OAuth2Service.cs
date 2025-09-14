using System.IdentityModel.Tokens.Jwt;
using Group8.LabEms.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Group8.LabEms.Api.Services
{

    public class OAuth2Service : IOAuth2Service
    {

        public static JwtSecurityToken DecodeJwt(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            return jwtToken;
        }

        public bool Authenticate(string token)
        {
            var jwtToken = DecodeJwt(token);

            // Get the token issuer
            var issuer = jwtToken.Issuer;

            // Get the token audience
            var audience = jwtToken.Audiences;

            // Get the token expiration time
            var expiration = jwtToken.ValidTo;

            // Get the token claims
            var claims = jwtToken.Claims;


            return true;
        }

    }
}