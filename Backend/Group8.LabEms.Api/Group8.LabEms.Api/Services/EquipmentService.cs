
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Services
{
    public class EquipmentService : IEquipmentService
    {

        private readonly AppDbContext _context;


        public EquipmentService(AppDbContext context)
        {
            _context = context;

        }
        public Task<EquipmentDTO> AddEquipment(EquipmentDTO equipmentDto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEquipment(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<EquipmentDTO>> GetAllEquipment()
        {
            var equipments = await _context.equipment.ToListAsync();
            return EquipmentMapper.MapToDTOList(equipments);
        }

        public Task<EquipmentDTO?> GetEquipmentById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<EquipmentDTO?> UpdateEquipment(int id, EquipmentDTO equipmentDto)
        {
            throw new NotImplementedException();
        }
    }
}
