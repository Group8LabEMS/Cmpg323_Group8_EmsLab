using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.DTO.Equipments;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Services
{
    public class EquipmentService : IEquipmentService
    {

        private readonly AppDbContext _context;
        private readonly IEquipmentService _equipmentService;
        public EquipmentService(AppDbContext context,
        IEquipmentService equipmentService)
        {
            _context = context;
            _equipmentService = equipmentService;
        }

        public async Task<IEnumerable<EquipmentDTO>> GetAllEquipments()
        {
            var equipments = await _context.Equipments.ToListAsync();

            return (IEnumerable<EquipmentDTO>)equipments;
        }

        Task<EquipmentDTO> IEquipmentService.CreateEquipment(AddEquipmentDTO addEquipmentDTO)
        {
            throw new NotImplementedException();
        }

        Task<bool> IEquipmentService.DeleteEquipment(int id)
        {
            throw new NotImplementedException();
        }



        Task<EquipmentDTO> IEquipmentService.GetEquipment(int id)
        {
            throw new NotImplementedException();
        }

        Task<EquipmentDTO> IEquipmentService.UpdateEquipment(int id, UpdateEquipmentDTO updateEquipmentDTO)
        {
            throw new NotImplementedException();
        }
    }
}