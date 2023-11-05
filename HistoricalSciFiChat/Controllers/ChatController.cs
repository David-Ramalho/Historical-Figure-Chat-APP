namespace HistoricalSciFiChat.Controllers;
using HistoricalSciFiChat.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/chat")]
[ApiController]
public class ChatController : ControllerBase
{
	private readonly HistoricalSciFiChatService _chatService;

	public ChatController(HistoricalSciFiChatService chatService)
	{
		_chatService = chatService;
	}

	[HttpPost]
	public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
	{
		// Null checks for the nullable properties
		if (string.IsNullOrEmpty(request.Message) || string.IsNullOrEmpty(request.FigureName))
		{
			return BadRequest("Message or FigureName is null or empty.");
		}

		var response = await _chatService.GetResponseAsync(request.Message, request.FigureName);
		return Ok(new { Message = response });
	}
}

public class ChatRequest
{
	public string? Message { get; set; }
	public string? FigureName { get; set; }
}
