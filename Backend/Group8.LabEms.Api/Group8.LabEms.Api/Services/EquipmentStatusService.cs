using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.DTO.EquipmentStatus;
using Group8.LabEms.Api.Models.Equipments;
using Group8.LabEms.Api.Profiles;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Services
{
    public class EquipmentStatusService : IEquipmentStatusService
    {

        private readonly AppDbContext _context;
        public EquipmentStatusService(AppDbContext context)
        {
            _context = context;

        }


        //ADD NEW EQUIPMENT STATUS TO THE DATABASE
        public async Task<EquipmentStatusDTO> AddEquipmentStatus(AddEquipmentStatusDTO dto)
        {
            var newEquipmentStatus = new EquipmentStatus
            {
                Description = dto.Description,
                Name = dto.Description
            };

            await _context.equipment_status.AddAsync(newEquipmentStatus);
            await _context.SaveChangesAsync();

            return new EquipmentStatusDTO
            {
                Id = newEquipmentStatus.Id,
                Description = newEquipmentStatus.Description,
                Name = newEquipmentStatus.Name
            };

        }

        public async Task<bool> DeleteEquipmentStatus(int id)
        {
            var equipStatusToDelete = await _context
            .equipment_status
            .FirstOrDefaultAsync(es => es.Id == id);
            if (equipStatusToDelete == null) return false;

            _context.equipment_status.Remove(equipStatusToDelete);
            await _context.SaveChangesAsync();
            return true;


        }

        public async Task<IEnumerable<EquipmentStatusDTO>> GetAllEquipmentStatus()
        {
            var equipStatuses = await _context.equipment_status.ToListAsync();
            return (IEnumerable<EquipmentStatusDTO>)Mapper.MapToDTOList(equipStatuses);
        }

        public async Task<EquipmentStatusDTO?> GetEquipmentStatusById(int id)
        {
            var statusId = await _context.equipment_status.FindAsync(id);
            if (statusId == null) return null;

            var statusDTO = new EquipmentStatusDTO
            {
                Description = statusId.Description,
                Name = statusId.Name,
                Id = statusId.Id
            };
            return statusDTO;
        }

        public async Task<EquipmentStatusDTO?> UpdateEquipmentStatus(int id, UpdateEquipmentStatusDTO dto)
        {
            var status = await _context.equipment_status.FirstOrDefaultAsync(s => s.Id == id);

            if (status == null) return null;

            //  UPDATE THE FIELDS HERE
            status.Description = dto.Description;
            status.Name = dto.Name;
          

            //PERSIST THE CHANGES

            await _context.SaveChangesAsync();

            //CONVERT BACK TO DTO 
            return new EquipmentStatusDTO
            {
                Id = status.Id,
                Description = status.Description,
                Name = status.Name
            };
        }

       
    }
}