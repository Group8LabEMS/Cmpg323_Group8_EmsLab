# Authentication and Authorization in LabEMS API

The LabEMS API uses JSON Web Tokens (JWT) for authentication and authorization. This document explains how the authentication process works and how to use it in your applications.

## JWT Token Structure

A JWT token consists of three parts separated by dots:
1. **Header**: Contains the algorithm used for signing
2. **Payload**: Contains the claims (data)
3. **Signature**: Verifies the token's integrity

Example token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Header: `{"alg":"HS256","typ":"JWT"}`

Payload: `{"sub":"1234567890","name":"John Doe","iat":1516239022}`

This specific token (signature part shown) corresponds to the example on jwt.io and is a valid JWS compact serialization for HS256 when verified with the example secret your-256-bit-secret.

If you want a custom JWS (different claims, expiry, or different alg like RS256), tell me the claims and algorithm and I'll show the exact compact token and verification snippet.

## How Authentication Works in LabEMS

1. **Token Generation**: When a user logs in, the server generates a JWT token containing their identity information.

2. **Token Storage**: The client stores this token (typically in browser storage or a secure cookie).

3. **Sending the Token**: For authenticated requests, the client includes the token in the Authorization header:
   ```
   Authorization: BearerToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Token Validation**: Our custom `OAuth2AuthenticationHandler` validates the token by:
   - Parsing the JWT token
   - Verifying the signature
   - Extracting user claims
   - Creating an authentication ticket if valid

5. **Authorization**: After authentication, the `CustomAuthorizeAttribute` checks if the user has the required permissions for the requested action.

## Implementation Details

- The `OAuth2AuthenticationHandler` class implements the `AuthenticationHandler<AuthenticationSchemeOptions>` interface to handle token validation.
- The `CustomAuthorizeAttribute` attribute can be applied to controllers and actions to restrict access based on permissions.
- Permissions are checked against the database using the `IPermissionService`.

## Usage Examples

### Securing an API Endpoint

```csharp
[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    [HttpGet]
    [Authorize(AuthenticationSchemes = "OAuth2")]
    public IActionResult GetAll()
    {
        // Only accessible by users with "equipment.view" permission
        return Ok();
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public IActionResult Create()
    {
        // Only accessible by users with "equipment.create" permission
        return Ok();
    }
}
```

### Making Authenticated Requests

```javascript
// Example using fetch
fetch('https://api.example.com/api/equipment', {
  headers: {
    'Authorization': 'BearerToken ' + jwtToken
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Testing Authentication

You can test authentication using tools like Postman or curl:

```bash
curl -X GET "https://localhost:5001/api/equipment" \
  -H "Authorization: BearerToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

For development testing, you can generate test tokens at [jwt.io](https://jwt.io/).
