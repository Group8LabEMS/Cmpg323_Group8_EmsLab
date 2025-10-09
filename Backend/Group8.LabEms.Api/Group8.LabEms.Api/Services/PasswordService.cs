using BCrypt.Net;

namespace Group8.LabEms.Api.Services
{
    public class PasswordService
    {
        public string HashPassword(string password) =>
            BCrypt.Net.BCrypt.HashPassword(password);

        public bool VerifyPassword(string password, string hashedPassword) =>
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}