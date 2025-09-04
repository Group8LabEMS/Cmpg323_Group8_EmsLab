using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.DTO.EquipmentStatus;
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

        [HttpPut("{id}")]
        public async Task<ActionResult<EquipmentDTO>> UpdateEquipment(int id, [FromBody] UpdateEquipmentDTO dto)
        {
            try
            {
                var equipment = await _service.UpdateEquipment(id, dto);
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
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            try
            {
                var equipment = await _service.DeleteEquipment(id);
                if (!equipment) return NotFound($"Equipment with id {id} does not exist");

                return NoContent();
            }
            catch (Exception ex)
            {

                return StatusCode(500,
             new
             {
                 message = "An error occurred while adding new equipment",
                 error = ex.Message
             });
            }
        }


        [HttpPost]
        public async Task<ActionResult<EquipmentDTO>> AddEquipment([FromBody] EquipmentDTO dto)
        {
            try
            {
                var equipment = await _service.AddEquipment(dto);
                return CreatedAtAction(nameof(GetEquipmentById), new { id = equipment.Id }, equipment);
            }
            catch (Exception ex)
            {

                return StatusCode(500,
               new
               {
                   message = "An error occurred while adding new equipment",
                   error = ex.Message
               });
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<EquipmentDTO>> GetEquipmentById(int id)
        {
            try
            {
                var equipment = await _service.GetEquipmentById(id);
                if (equipment == null) return NotFound("Equipment with that id does not exist");
                return Ok(equipment);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new
                {
                    message = "An error occurred while retrieving equipment",
                    error = ex.Message
                });
            }
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
                return StatusCode(500,
                new
                {
                    message = "An error occurred while retrieving available equipmentss",
                    error = ex.Message
                });

            }
        }
    }
}