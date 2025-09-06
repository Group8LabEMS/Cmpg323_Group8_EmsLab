using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.DTO.EquipmentStatus;
using Group8.LabEms.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Group8.LabEms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentStatusController : ControllerBase
    {
        private readonly IEquipmentStatusService _service;
        public EquipmentStatusController(IEquipmentStatusService service)
        {
            _service = service;

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EquipmentStatusDTO>> UpdateStatus(int id, [FromBody] UpdateEquipmentStatusDTO dto)
        {
            try
            {
                var equipment = await _service.UpdateEquipmentStatus(id, dto);
                return Ok(equipment);

            }
            catch (Exception ex)
            {

                return StatusCode(500,
            new
            {
                message = "An error occurred while updating equipment",
                error = ex.Message
            });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipmentStatus(int id)
        {
            try
            {
                var status = await _service.DeleteEquipmentStatus(id);
                if (!status) return NotFound($"status with id {id} does not exist");

                return NoContent();
            }
            catch (Exception ex)
            {

                return StatusCode(500,
             new
             {
                 message = "An error occurred while deleting equipment status",
                 error = ex.Message
             });
            }
        }

        [HttpPost]
        public async Task<ActionResult<EquipmentStatusDTO>> AddEquipmentStatus([FromBody] EquipmentStatusDTO dto)
        {
            try
            {
                var status = await _service.AddEquipmentStatus(dto);
                return CreatedAtAction(nameof(GetEquipmentStatusById), new { id = status.Id }, status);
            }
            catch (Exception ex)
            {

                return StatusCode(500,
               new
               {
                   message = "An error occurred while adding new status",
                   error = ex.Message
               });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EquipmentStatusDTO>> GetEquipmentStatusById(int id)
        {
            try
            {
                var status = await _service.GetEquipmentStatusById(id);
                if (status == null) return NotFound("Status with that id does not exist");
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new
                {
                    message = "An error occurred while retrieving status",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentStatusDTO>>> GetAllEquipmentStatus()
        {
            try
            {
                var statuses = await _service.GetAllEquipmentStatus();
                return Ok(statuses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving available equipments statuses", error = ex.Message });

            }
        }
    }
}