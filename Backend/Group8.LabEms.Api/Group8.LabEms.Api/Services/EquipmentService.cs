
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.Models.Equipments;
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
        public async Task<EquipmentDTO> AddEquipment(EquipmentDTO equipmentDto)
        {
            var newEquipment = new Equipment
            {
                Availability = equipmentDto.Availability,
                Name = equipmentDto.Name,
                CreatedAt = equipmentDto.CreatedAt,
                EquipmentStatusId = equipmentDto.EquipmentStatusId,
                EquipmentTypeId = equipmentDto.EquipmentStatusId,

            };

            await _context.equipment.AddAsync(newEquipment);
            await _context.SaveChangesAsync();

            return new EquipmentDTO
            {
                Id = newEquipment.Id,
                Availability = newEquipment.Availability,
                Name = newEquipment.Name,
                CreatedAt = newEquipment.CreatedAt,
                EquipmentStatusId = newEquipment.EquipmentStatusId,
                EquipmentTypeId = newEquipment.EquipmentTypeId
            };
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

        public async Task<EquipmentDTO?> GetEquipmentById(int id)
        {
            var equipment = await _context.equipment.FindAsync(id);
            if (equipment == null) return null;

            var equipDTO = new EquipmentDTO
            {
                Availability = equipment.Availability,
                CreatedAt = equipment.CreatedAt,
                EquipmentStatusId = equipment.EquipmentStatusId,
                EquipmentTypeId = equipment.EquipmentTypeId,
                Id = equipment.Id,
                Name = equipment.Name
            };
            return equipDTO;
        }

        public Task<EquipmentDTO?> UpdateEquipment(int id, EquipmentDTO equipmentDto)
        {
            throw new NotImplementedException();
        }
    }
}
