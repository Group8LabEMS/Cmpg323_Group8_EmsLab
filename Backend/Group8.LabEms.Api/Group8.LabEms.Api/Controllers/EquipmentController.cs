using System.Collections;
using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Group8.LabEms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _service;
        public EquipmentController(IEquipmentService service)
        {
            _service = service;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentDTO>>> GetAllEquipment()
        {
            try
            {
                var equipments = await _service.GetAllEquipment();
                return Ok(equipments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving available equipmentss", error = ex.Message });

            }
        }
    }
}