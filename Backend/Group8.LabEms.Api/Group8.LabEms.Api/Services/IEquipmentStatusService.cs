using Group8.LabEms.Api.DTO.EquipmentStatus;

namespace Group8.LabEms.Api.Services
{
    public interface IEquipmentStatusService
    {
        Task<IEnumerable<EquipmentStatusDTO>> GetAllEquipmentStatus();
        Task<EquipmentStatusDTO?> GetEquipmentStatusById(int id);
        Task<EquipmentStatusDTO> AddEquipmentStatus(EquipmentStatusDTO dto);
        Task<EquipmentStatusDTO?> UpdateEquipmentStatus(int id, EquipmentStatusDTO dto);
        Task<bool> DeleteEquipmentStatus(int id);
    }
    
}