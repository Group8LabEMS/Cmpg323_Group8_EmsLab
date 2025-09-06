
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
        public async Task<EquipmentDTO> AddEquipment(AddEquipmentDTO equipmentDto)
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

        public async Task<bool> DeleteEquipment(int id)
        {
            var equipToDelete = await _context.equipment
            .FirstOrDefaultAsync(e => e.Id == id);

            if (equipToDelete == null) return false;

            _context.Remove(equipToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EquipmentDTO>> GetAllEquipment()
        {
            var equipments = await _context.equipment.ToListAsync();
            return Mapper.MapToDTOList(equipments);
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

        public async Task<EquipmentDTO?> UpdateEquipment(int id, UpdateEquipmentDTO dto)
        {
            var equipment = await _context
            .equipment
            .FirstOrDefaultAsync(e => e.Id == id);

            if (equipment == null) return null;

            equipment.Availability = dto.Availability;
            equipment.Name = dto.Name;
            equipment.CreatedAt = dto.CreatedAt;
            equipment.EquipmentStatusId = dto.EquipmentStatusId;
            equipment.EquipmentTypeId = dto.EquipmentTypeId;


            await _context.SaveChangesAsync();

            return new EquipmentDTO
            {
                Availability = equipment.Availability,
                Name = equipment.Name,
                CreatedAt = equipment.CreatedAt,
                EquipmentStatusId = equipment.EquipmentStatusId,
                EquipmentTypeId = equipment.EquipmentTypeId,
                Id = equipment.Id
            };
        }
    }
}
