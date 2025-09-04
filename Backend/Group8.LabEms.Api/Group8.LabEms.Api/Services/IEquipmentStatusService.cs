using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.DTO.EquipmentStatus;

namespace Group8.LabEms.Api.Services
{
    public interface IEquipmentStatusService
    {
        Task<IEnumerable<EquipmentStatusDTO>> GetAllEquipmentStatus();
        Task<EquipmentStatusDTO?> GetEquipmentStatusById(int id);
        Task<EquipmentStatusDTO> AddEquipmentStatus(AddEquipmentStatusDTO dto);
        Task<EquipmentStatusDTO?> UpdateEquipmentStatus(int id, UpdateEquipmentStatusDTO dto);
        Task<bool> DeleteEquipmentStatus(int id);
    }
    
}