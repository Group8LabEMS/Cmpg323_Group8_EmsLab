using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.DTO.EquipmentStatus;
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


        public Task<EquipmentStatusDTO> AddEquipmentStatus(EquipmentStatusDTO dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEquipmentStatus(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<EquipmentStatusDTO>> GetAllEquipmentStatus()
        {
            var equipStatuses = await _context.equipment_status.ToListAsync();
            return (IEnumerable<EquipmentStatusDTO>)EquipmentMapper.MapToDTOList(equipStatuses);
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

        public Task<EquipmentStatusDTO?> UpdateEquipmentStatus(int id, EquipmentStatusDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}