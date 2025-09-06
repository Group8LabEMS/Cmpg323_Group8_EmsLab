
using Group8.LabEms.Api.DTO.EquipmentType;

namespace Group8.LabEms.Api.Services
{
    public interface IEquipmentTypeService
    {
        Task<IEnumerable<EquipmentTypeDTO?>> GetAllEquipmentType();
        Task<EquipmentTypeDTO?> GetEquipmentTypeById(int id);
        Task<EquipmentTypeDTO> AddEquipmentType(AddEquipmentTypeDTO dto);
        Task<EquipmentTypeDTO?> UpdateEquipmentType(int id, UpdateEquipmentTypeDTO dto);
        Task<bool> DeleteEquipmentType(int id);
    }

}