using System.Threading.Tasks;

namespace Group8.LabEms.Api.Services.Interfaces
{
    public interface IPermissionService
    {
        Task<bool> UserHasPermissionAsync(string userId, string permission);
        bool IsValidUser(string username, string password);
    }
}