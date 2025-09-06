using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.DTO.EquipmentStatus;
using Group8.LabEms.Api.DTO.EquipmentType;
using Group8.LabEms.Api.Models.Equipments;
using Group8.LabEms.Api.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Services
{
    public class EquipmentTypeService : IEquipmentTypeService
    {

        private readonly AppDbContext _context;

        public EquipmentTypeService(AppDbContext context)
        {
            _context = context;

        }
        public async Task<EquipmentTypeDTO> AddEquipmentType(AddEquipmentTypeDTO dto)
        {
            var newEquipmentType = new EquipmentType
            {
                Description = dto.Description,
                Name = dto.Description
            };

            await _context.equipment_type.AddAsync(newEquipmentType);
            await _context.SaveChangesAsync();

            return new EquipmentTypeDTO
            {
                Description = newEquipmentType.Description,
                Id = newEquipmentType.Id,
                Name = newEquipmentType.Name
            };
        }

        public async Task<bool> DeleteEquipmentType(int id)
        {
            var equipmentTypeToDelete = await _context.equipment_type.FirstOrDefaultAsync(et => et.Id == id);
            if (equipmentTypeToDelete == null) return false;

            _context.equipment_type.Remove(equipmentTypeToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EquipmentTypeDTO>?> GetAllEquipmentType()
        {
            var equipmentTypes = await _context.equipment_type.ToListAsync();
            if (equipmentTypes == null) return null;
            return Mapper.MapToDTOList(equipmentTypes);
        }

        public async Task<EquipmentTypeDTO?> GetEquipmentTypeById(int id)
        {
            var foundEquipmentType = await _context.equipment_type.FindAsync(id);
            if (foundEquipmentType == null) return null;

            var foundEquipmentTypeDTO = new EquipmentTypeDTO
            {
                Description = foundEquipmentType.Description,
                Name = foundEquipmentType.Name,
                Id = foundEquipmentType.Id
            };


            return foundEquipmentTypeDTO;
        }

        public async Task<EquipmentTypeDTO?> UpdateEquipmentType(int id, UpdateEquipmentTypeDTO dto)
        {
            var updateType = await _context.equipment_type.FirstOrDefaultAsync(type => type.Id == id);
            if (updateType == null) return null;

            updateType.Description = dto.Description;
            updateType.Name = dto.Name;

            await _context.SaveChangesAsync();

            return new EquipmentTypeDTO
            {
                Id = updateType.Id,
                Description = updateType.Description,
                Name = updateType.Name
            };
        }
    }


}