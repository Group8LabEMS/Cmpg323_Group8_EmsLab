using Group8.LabEms.Api.DTO.Equipments;

namespace Group8.LabEms.Api.Services
{
    public interface IEquipmentService
    {
        public Task<IEnumerable<EquipmentDTO>> GetAllEquipments();
        public Task<EquipmentDTO> GetEquipment(int id);
        public Task<EquipmentDTO> CreateEquipment(AddEquipmentDTO addEquipmentDTO);
        public Task<EquipmentDTO> UpdateEquipment(int id, UpdateEquipmentDTO updateEquipmentDTO);
        public Task<bool> DeleteEquipment(int id);

    }

}