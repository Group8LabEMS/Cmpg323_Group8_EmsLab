using Group8.LabEms.Api.DTO.Equipments;

namespace Group8.LabEms.Api.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<EquipmentDTO>> GetAllEquipment();
        Task<EquipmentDTO?> GetEquipmentById(int id);
        Task<EquipmentDTO> AddEquipment(AddEquipmentDTO equipmentDto);
        Task<EquipmentDTO?> UpdateEquipment(int id, UpdateEquipmentDTO equipmentDto);
        Task<bool> DeleteEquipment(int id);

    }

}